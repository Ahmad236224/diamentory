// Full homepage capture with reveals settled (reduced motion), split into viewport-height tiles.
import { chromium } from "@playwright/test";
const [, , w = "390", out = ".", h = "844"] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" });
const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:3217/", { waitUntil: "networkidle", timeout: 120000 });
for (let y = 0; y < 30000; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
const tile = Math.round(+h * 2.4);
for (let i = 0, y = 0; y < H; i++, y += tile) await p.screenshot({ path: `${out}/home-${w}-${i}.png`, fullPage: true, clip: { x: 0, y, width: +w, height: Math.min(tile, H - y) } });
console.log(JSON.stringify({ w, H, overflow, tiles: Math.ceil(H / tile), errs: errs.slice(0, 3) }));
await b.close();
