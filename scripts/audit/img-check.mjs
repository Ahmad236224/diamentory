// Lists images that never finished loading on a page. Usage: node scripts/audit/img-check.mjs <path> [width]
import { chromium } from "@playwright/test";
const [, , path = "/", w = "1440"] = process.argv;
const base = process.env.BASE ?? "http://localhost:3217";
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: +w, height: 900 } });
const failed = [];
page.on("response", (r) => r.url().includes("/_next/image") && r.status() >= 400 && failed.push(r.status() + " " + r.url().slice(0, 140)));
await page.goto(base + path, { waitUntil: "load" });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(250); }
await page.waitForTimeout(8000);
const bad = await page.evaluate(() => [...document.images].filter((i) => !(i.complete && i.naturalWidth)).map((i) => ({ src: i.currentSrc || i.src, loading: i.loading, vis: getComputedStyle(i).visibility, top: Math.round(i.getBoundingClientRect().top + scrollY) })));
console.log(JSON.stringify({ total: await page.evaluate(() => document.images.length), bad, failed }, null, 1));
await b.close();
