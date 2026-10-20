// Viewport screenshots at given scroll offsets on a phone. Usage: node viewport-scroll.mjs <out> <path> <y1,y2,...> [width]
import { chromium, devices } from "@playwright/test";
const [, , out, path, ys = "0", w = "390"] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices["iPhone 13"], viewport: { width: +w, height: 844 }, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto((process.env.BASE ?? "http://localhost:3217") + path, { waitUntil: "load" });
await p.waitForTimeout(2500);
for (const y of ys.split(",").map(Number)) {
  await p.evaluate((y) => scrollTo(0, y), y);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}-${y}.png` });
}
await b.close();
