// Usage: node scripts/shot.mjs <path> <width> <outfile> [fullPage=1] [height]
import { chromium } from "@playwright/test";
const [, , path = "/", width = "390", out = "shot.png", full = "1", height = "844"] = process.argv;
const base = process.env.BASE ?? "http://localhost:3217";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: +height }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + path, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1500);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await page.screenshot({ path: out, fullPage: full === "1" });
console.log(JSON.stringify({ path, width, overflow, errors: errors.slice(0, 5) }));
await browser.close();
