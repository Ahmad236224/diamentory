// Responsive audit: every page × every width (portrait + landscape for touch sizes).
// Usage: node scripts/audit/responsive-audit.mjs <outDir> [base=http://localhost:3217]
// Writes <outDir>/report.json and screenshots (<outDir>/shots/<w>x<h>-<page>.png for key sizes).
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const out = process.argv[2] ?? "audit-out";
const base = process.argv[3] ?? "http://localhost:3217";
mkdirSync(`${out}/shots`, { recursive: true });

export const PAGES = [
  "/", "/shop", "/shop/rings", "/shop/chains", "/shop/chains?style=locket", "/shop/bracelets",
  "/new-arrivals", "/collections", "/collections/gold", "/collections/silver", "/collections/two-tone",
  "/search?q=chain", "/search?q=zzzz",
  "/product/onyx-square-locket", "/product/cuban-link-chain", "/product/textured-band-ring", "/product/iced-cuban-bracelet",
  "/cart", "/checkout", "/track-order", "/our-story", "/lookbook", "/contact", "/shipping", "/returns", "/faq",
  "/privacy", "/terms", "/does-not-exist",
];

// [width, height, label]; landscape variants for touch sizes
const SIZES = [
  [320, 568, "p"], [360, 780, "p"], [375, 667, "p"], [390, 844, "p"], [414, 896, "p"], [430, 932, "p"],
  [768, 1024, "p"], [1024, 768, "l"], [1440, 900, "d"],
  [568, 320, "l"], [844, 390, "l"], [932, 430, "l"], [1024, 1366, "p"],
];
const SHOT_SIZES = new Set(["320x568", "390x844", "768x1024", "1440x900", "844x390"]);
const SHOT_PAGES = new Set(["/", "/shop/chains", "/product/onyx-square-locket", "/cart", "/checkout", "/our-story", "/lookbook", "/contact"]);

const browser = await chromium.launch();
const results = [];

for (const [w, h, kind] of SIZES) {
  const touch = w < 1024 || kind === "l";
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: w < 768 || (kind === "l" && h < 500), deviceScaleFactor: 1 });
  // seed a bag so cart/checkout render their full layout
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("diamentory.cart.v1"))
        localStorage.setItem("diamentory.cart.v1", JSON.stringify([{ slug: "onyx-square-locket", variantId: "onyx-square-locket--gold", qty: 1, priceAtAdd: 5200 }, { slug: "cuban-link-chain", variantId: "cuban-link-chain--silver-20-in", qty: 2, priceAtAdd: 6800 }]));
    } catch {}
    // cumulative layout shift
    window.__cls = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const errors = [];
    page.removeAllListeners("pageerror");
    page.removeAllListeners("console");
    page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
    page.on("console", (m) => m.type() === "error" && !/404|Failed to load resource/.test(m.text()) && errors.push(m.text().slice(0, 160)));
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 60000 });
    } catch (e) {
      results.push({ w, h, path, fatal: String(e).slice(0, 120) });
      continue;
    }
    // scroll through to trigger lazy images + reveals, then back to top
    await page.evaluate(async () => {
      const H = document.documentElement.scrollHeight;
      for (let y = 0; y < H; y += Math.round(innerHeight * 0.8)) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
        if (el.closest("dialog:not([open]), [hidden], [aria-hidden=true]")) return false;
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      };
      const inScroller = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === "auto" || ox === "scroll" || ox === "hidden" || ox === "clip") return true;
        }
        return false;
      };
      const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${[...el.classList].slice(0, 3).join(".")}|${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}`;

      const overflow = document.documentElement.scrollWidth - vw;
      const offenders = [];
      if (overflow > 0) {
        for (const el of document.querySelectorAll("body *")) {
          if (!visible(el) || inScroller(el)) continue;
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1 || b.left < -1) offenders.push(desc(el));
          if (offenders.length > 6) break;
        }
      }

      // clipped text: headings / buttons / links / labels whose content is wider than their box
      const clipped = [];
      for (const el of document.querySelectorAll("h1,h2,h3,h4,button,a,label,p,span.eyebrow,dd,dt,td,th")) {
        if (!visible(el) || el.closest(".sr-only")) continue;
        const cs = getComputedStyle(el);
        if (cs.overflow === "visible" && cs.textOverflow !== "ellipsis") {
          // visible overflow: check if text pokes out of the viewport or its section
          const b = el.getBoundingClientRect();
          if (el.scrollWidth > el.clientWidth + 2 && /^H[1-4]$/.test(el.tagName)) clipped.push(desc(el));
          else if (b.right > vw + 1 && !inScroller(el)) clipped.push(desc(el));
        } else if (el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== "ellipsis" && !el.querySelector("img,svg")) {
          clipped.push(desc(el));
        }
        if (clipped.length > 8) break;
      }

      // tiny text (< 11px) in visible text-bearing elements
      const tiny = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (!t.textContent.trim()) continue;
        const el = t.parentElement;
        if (!el || !visible(el) || el.closest(".sr-only")) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 11) tiny.add(`${fs}px:${t.textContent.trim().slice(0, 24)}`);
        if (tiny.size > 8) break;
      }

      // tap targets (interactive, not inline text links inside paragraphs)
      const small = [];
      for (const el of document.querySelectorAll("a[href],button,input:not([type=hidden]),select,textarea,summary,[role=tab]")) {
        if (!visible(el) || el.closest(".sr-only")) continue;
        if (el.tagName === "A" && el.closest("p, li p, .prose-legal")) continue;
        if (el.matches("input[type=radio].sr-only, input[type=checkbox].sr-only")) continue;
        const b = el.getBoundingClientRect();
        if (b.height < 40 || b.width < 40) small.push(`${Math.round(b.width)}x${Math.round(b.height)} ${desc(el)}`);
        if (small.length > 12) break;
      }

      // image crop: fraction of the natural image actually shown (object-fit: cover)
      const crops = [];
      for (const img of document.querySelectorAll("main img")) {
        if (!visible(img) || !img.naturalWidth) continue;
        const b = img.getBoundingClientRect();
        if (b.width < 60) continue;
        const ir = img.naturalWidth / img.naturalHeight, br = b.width / b.height;
        const shown = ir > br ? br / ir : ir / br; // share of the long axis kept
        if (shown < 0.5) crops.push(`${Math.round(shown * 100)}% ${(img.getAttribute("src") || "").split("url=")[1]?.split("&")[0]?.slice(0, 60)} @${Math.round(b.width)}x${Math.round(b.height)}`);
      }
      const unloaded = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length;

      return {
        overflow,
        offenders,
        clipped,
        tiny: [...tiny],
        small,
        crops: [...new Set(crops)].slice(0, 6),
        unloaded,
        cls: Math.round((window.__cls || 0) * 1000) / 1000,
        h1: document.querySelectorAll("h1").length,
        height: document.documentElement.scrollHeight,
      };
    });
    const key = `${w}x${h}`;
    if (SHOT_SIZES.has(key) && SHOT_PAGES.has(path)) {
      const name = path === "/" ? "home" : path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      await page.screenshot({ path: `${out}/shots/${key}-${name}.png`, fullPage: false });
      await page.screenshot({ path: `${out}/shots/${key}-${name}-full.png`, fullPage: true });
    }
    results.push({ w, h, path, ...r, errors });
  }
  await ctx.close();
}
await browser.close();

writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 2));

// summary
const bad = (x) => x.fatal || x.overflow > 0 || x.clipped?.length || x.errors?.length || x.unloaded || x.cls > 0.1 || (x.h1 !== 1 && x.path !== "/does-not-exist");
const bySize = {};
for (const x of results) {
  const k = `${x.w}x${x.h}`;
  bySize[k] ??= { pages: 0, fail: 0 };
  bySize[k].pages++;
  if (bad(x)) bySize[k].fail++;
}
console.log("SIZE SUMMARY", JSON.stringify(bySize));
for (const x of results.filter(bad)) console.log("FAIL", JSON.stringify({ s: `${x.w}x${x.h}`, p: x.path, fatal: x.fatal, ov: x.overflow, off: x.offenders, clip: x.clipped, err: x.errors, cls: x.cls, unl: x.unloaded, h1: x.h1 }));
// advisory buckets (deduped across sizes)
const agg = (field) => {
  const m = new Map();
  for (const x of results) for (const v of x[field] ?? []) m.set(v.replace(/^\d+x\d+ /, "") + ` [${x.path}]`, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
};
console.log("SMALL TARGETS", JSON.stringify(agg("small"), null, 0));
console.log("TINY TEXT", JSON.stringify(agg("tiny"), null, 0));
console.log("HEAVY CROPS", JSON.stringify(agg("crops"), null, 0));
