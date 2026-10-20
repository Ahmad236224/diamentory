// Full-page screenshot split into readable segments (reduced motion so reveals are settled).
// Usage: node scripts/audit/segments.mjs <outDir> <width> <path> [segH]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const [, , out = "seg", w = "390", path = "/", segH = "1400"] = process.argv;
const base = process.env.BASE ?? "http://localhost:3217";
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ reducedMotion: "reduce", viewport: { width: +w, height: +w < 768 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: +w < 768, hasTouch: +w < 1024 });
await ctx.addInitScript(() => { try { if (!localStorage.getItem("diamentory.cart.v1")) localStorage.setItem("diamentory.cart.v1", JSON.stringify([{ slug: "onyx-square-locket", variantId: "onyx-square-locket--gold", qty: 1, priceAtAdd: 5200 }])); } catch {} });
const page = await ctx.newPage();
await page.goto(base + path, { waitUntil: "load", timeout: 90000 });
const H = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(150); }
await page.evaluate(() => scrollTo(0, 0));
await page.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().width > 0).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 45000 }).catch(() => console.log("images pending"));
await page.waitForTimeout(600);
const name = path === "/" ? "home" : path.slice(1).replace(/[/?=&]/g, "_");
const n = Math.ceil(H / +segH);
for (let i = 0; i < n; i++) {
  const y = i * +segH;
  await page.screenshot({ path: `${out}/${name}-${w}-${i}.png`, fullPage: true, clip: { x: 0, y, width: +w, height: Math.min(+segH, H - y) } });
}
console.log(name, w, "segments", n, "overflow", await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await b.close();
