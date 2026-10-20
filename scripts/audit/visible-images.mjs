// Scroll like a user (motion ON), then report every image frame that is on-page but not visibly rendered.
// Checks pixels, not DOM: loaded, non-zero size, opacity/clip, and an actual screenshot of the section.
// Usage: node scripts/audit/visible-images.mjs <url> <width> <height> <outPrefix> [sectionSelector]
import { chromium } from "@playwright/test";
const [, , url, w = "1440", h = "900", out = "vis", section] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: +w < 768, hasTouch: +w < 1024, deviceScaleFactor: +w < 768 ? 2 : 1 });
const p = await ctx.newPage();
const failed = [];
p.on("response", (r) => r.request().resourceType() === "image" && r.status() >= 400 && failed.push(r.status() + " " + r.url()));
p.on("requestfailed", (r) => r.resourceType() === "image" && failed.push("FAILED " + r.url()));
await p.goto(url, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
// user-like scroll: wheel steps
for (let y = 0; y < H; y += 120) { await p.mouse.wheel(0, 120); await p.waitForTimeout(40); }
await p.waitForTimeout(1500);
const bad = await p.evaluate(() => {
  const out = [];
  for (const img of document.querySelectorAll("main img")) {
    const r = img.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue; // hidden (tabs, closed dialogs, hidden routes)
    // intentional stacked layers: hover-swap photo on cards, inactive Chain & Lockets frames
    if (img.matches(".chain-shot:not(.is-active)") || img.closest("[class*='group-hover:opacity-100']")) continue;
    let el = img, op = 1, clip = "", zero = "";
    while (el && el !== document.body) { const cs = getComputedStyle(el); if (+cs.opacity < 0.5 && !zero) zero = el.tagName + "." + String(el.className).slice(0, 90); op *= +cs.opacity; if (cs.clipPath !== "none" && !clip) clip = cs.clipPath; if (cs.visibility === "hidden") op = 0; el = el.parentElement; }
    const loaded = img.complete && img.naturalWidth > 0;
    const clipped = /inset\((100|9\d)%/.test(clip);
    if (!loaded || op < 0.5 || clipped) out.push({ src: (img.currentSrc || img.src).split("url=")[1]?.split("&")[0] ?? img.src, loaded, op: +op.toFixed(2), clip, wrap: img.closest("[class*=reveal]")?.className.slice(0, 60), zero });
  }
  return out;
});
console.log(JSON.stringify({ url, w, invisible: bad, failed }, null, 1));
if (section) {
  const s = p.locator(section).first();
  await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(1600);
  await p.screenshot({ path: `${out}-section.png` });
}
await b.close();
