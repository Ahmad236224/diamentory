// Full-page screenshots of key pages at several widths (scrolls first so reveals fire).
// Usage: node scripts/audit/batch-shots.mjs <outDir> [widths=390,1440] [paths=comma list]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "shots";
const widths = (process.argv[3] ?? "390,1440").split(",").map(Number);
const paths = (process.argv[4] ?? "/,/shop,/shop/rings,/product/onyx-square-locket,/cart,/checkout,/our-story,/lookbook").split(",");
const base = process.env.BASE ?? "http://localhost:3217";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 1024 });
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("diamentory.cart.v1"))
        localStorage.setItem("diamentory.cart.v1", JSON.stringify([{ slug: "onyx-square-locket", variantId: "onyx-square-locket--gold", qty: 1, priceAtAdd: 5200 }]));
    } catch {}
  });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(800);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 60000 })
      .catch(() => console.log("  images still loading"));
    await page.waitForTimeout(900);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const name = (p === "/" ? "home" : p.slice(1).replace(/[/?=&]/g, "_")) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    console.log(name, "overflow", overflow);
  }
  await ctx.close();
}
await browser.close();
