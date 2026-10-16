// Viewport screenshots after scrolling to a selector; reports images that never loaded.
import { chromium } from "@playwright/test";
const [, , out, w = "1440", h = "900"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto("http://localhost:3217/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
await p.screenshot({ path: `${out}/vp-${w}-hero.png` });
for (const id of ["bracelets", "chains"]) {
  const el = p.locator(`section[aria-labelledby*="${id}"]`).first();
  if (await el.count()) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await p.screenshot({ path: `${out}/vp-${w}-${id}.png` }); }
}
const broken = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
const notLoaded = await p.evaluate(() => [...document.images].filter((i) => !i.complete).map((i) => (i.currentSrc || i.src).slice(0, 90)));
console.log("broken:", broken.length, broken.slice(0, 5), "| still loading:", notLoaded.length, notLoaded.slice(0, 5));
await b.close();
