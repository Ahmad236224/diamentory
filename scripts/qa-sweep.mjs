// Site-wide responsive QA sweep.
// Usage: BASE=http://localhost:3217 node scripts/qa-sweep.mjs <outDir>
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.env.BASE ?? "http://localhost:3217";
const out = process.argv[2] ?? "qa-out";
mkdirSync(out, { recursive: true });

const ROUTES = [
  "/", "/shop", "/shop/rings", "/shop/chains", "/shop/chains?style=locket", "/shop/bracelets",
  "/new-arrivals", "/collections", "/collections/gold", "/search?q=chain", "/search?q=zzz",
  "/product/onyx-square-locket", "/product/cuban-link-chain", "/product/iced-cuban-bracelet", "/product/textured-band-ring",
  "/cart", "/checkout", "/track-order", "/our-story", "/lookbook", "/contact", "/shipping",
  "/returns", "/faq", "/privacy", "/terms", "/nope-404",
];
const WIDTHS = [320, 375, 768, 1440];

const browser = await chromium.launch();
const report = [];
const links = new Set();

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    const errors = [];
    page.removeAllListeners("pageerror");
    page.removeAllListeners("console");
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && !/404 \(Not Found\)/.test(m.text()) && errors.push(m.text()));
    const res = await page.goto(base + r, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(300);
    const data = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const small = [...document.querySelectorAll("a[href], button, input, select, textarea, summary, label:has(input)")]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (!b.width || cs.visibility === "hidden" || el.closest("[hidden],dialog:not([open])")) return false;
          // inline text links inside paragraphs are exempt (WCAG 2.5.8 inline exception)
          if (el.tagName === "A" && el.closest("p, li.prose, .prose-legal")) return false;
          return b.height < 24 || b.width < 24;
        })
        .map((el) => `${el.tagName.toLowerCase()}:${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}`);
      const imgsNoAlt = [...document.querySelectorAll("img:not([alt])")].length;
      const h1 = document.querySelectorAll("h1").length;
      const hrefs = [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href"));
      return { overflow, small: [...new Set(small)].slice(0, 6), imgsNoAlt, h1, hrefs, title: document.title };
    });
    data.hrefs.forEach((h) => links.add(h.split("#")[0]));
    const row = { w, r, status: res?.status(), overflow: data.overflow, h1: data.h1, imgsNoAlt: data.imgsNoAlt, small: data.small, errors: errors.slice(0, 3), title: data.title };
    report.push(row);
    if (w === 375 || w === 1440) {
      const name = r === "/" ? "home" : r.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      await page.screenshot({ path: `${out}/${w}-${name}.png`, fullPage: true });
    }
  }
  await ctx.close();
}

// link check
const broken = [];
for (const h of links) {
  // status only — streamed (PPR) bodies are not awaited
  const ac = new AbortController();
  const r = await fetch(base + h, { signal: ac.signal, redirect: "follow" }).catch((e) => ({ status: 0, e }));
  ac.abort();
  if (!r.status || r.status >= 400) broken.push(`${r.status} ${h}`);
}
await browser.close();

const issues = report.filter((x) => x.overflow > 0 || x.errors.length || x.h1 !== 1 || x.imgsNoAlt || x.small.length || (x.status !== 200 && x.r !== "/nope-404"));
writeFileSync(`${out}/report.json`, JSON.stringify({ report, broken, linksChecked: links.size }, null, 2));
console.log(`pages: ${report.length}  links checked: ${links.size}  broken: ${broken.length}`);
broken.forEach((b) => console.log("BROKEN", b));
issues.forEach((x) => console.log(JSON.stringify({ w: x.w, r: x.r, status: x.status, overflow: x.overflow, h1: x.h1, alt: x.imgsNoAlt, small: x.small, errors: x.errors })));
