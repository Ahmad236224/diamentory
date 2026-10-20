// Bytes of images actually downloaded per page (after Next's AVIF/WebP + resizing). Usage: node image-weight.mjs <base> <path,path,...>
import { chromium, devices } from "@playwright/test";
const [, , base = "http://localhost:3300", list = "/"] = process.argv;
const b = await chromium.launch();
for (const [label, opts] of [["390", { ...devices["iPhone 13"] }], ["1440", { viewport: { width: 1440, height: 900 } }]]) {
  for (const path of list.split(",")) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    const imgs = new Map();
    p.on("response", async (r) => { if (r.request().resourceType() === "image") { try { const len = (await r.body()).length; imgs.set(r.url(), { len, type: r.headers()["content-type"] }); } catch {} } });
    await p.goto(base + path, { waitUntil: "load" }); await p.waitForTimeout(1500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 300) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80); }
    await p.waitForTimeout(1200);
    const all = [...imgs.values()]; const total = all.reduce((s, i) => s + i.len, 0);
    const big = [...imgs.entries()].sort((a, c) => c[1].len - a[1].len)[0];
    console.log(`${label}px ${path.padEnd(28)} ${String(all.length).padStart(3)} imgs ${(total / 1024).toFixed(0).padStart(5)} KB  largest ${(big?.[1].len / 1024 || 0).toFixed(0)} KB ${big?.[1].type ?? ""} ${decodeURIComponent(big?.[0] ?? "").split("url=")[1]?.split("&")[0] ?? ""}`);
    await ctx.close();
  }
}
await b.close();
