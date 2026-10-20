// Viewport screenshots one screen apart, scrolling with the wheel (motion ON) — what a visitor sees.
// Usage: node scripts/audit/scroll-frames.mjs <url> <width> <height> <outPrefix> [step=viewport height]
import { chromium, devices } from "@playwright/test";
const [, , url, w = "1440", h = "900", out = "frame", stepArg] = process.argv;
const step = +(stepArg ?? h);
const b = await chromium.launch();
const ctx = +w < 768 ? await b.newContext({ ...devices["iPhone 13"], viewport: { width: +w, height: +h } }) : await b.newContext({ viewport: { width: +w, height: +h } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(2200);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += step, i++) {
  if (i) { for (let s = 0; s < step; s += 100) { await p.mouse.wheel(0, 100); await p.waitForTimeout(25); } if (+w < 768) await p.evaluate((y) => scrollTo(0, y), y); }
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${out}-${String(i).padStart(2, "0")}.png` });
}
console.log("frames", i);
await b.close();
