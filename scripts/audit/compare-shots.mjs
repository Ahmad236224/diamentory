// Before/after viewport screenshots (motion ON, wheel-scrolled like a visitor).
// Usage: node scripts/audit/compare-shots.mjs <base> <outDir> <tag>
//   e.g. node scripts/audit/compare-shots.mjs https://diamentory.vercel.app .qa/before live
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [, , base = "http://localhost:3300", out = ".qa/after", tag = "local"] = process.argv;
mkdirSync(out, { recursive: true });
const SECTIONS = ["hero-title", "rings-title", "chains-title", "bracelets-title"];
const PAGES = ["/shop", "/product/onyx-square-locket", "/cart", "/checkout"];

const b = await chromium.launch();
for (const [w, opts] of [["1440", { viewport: { width: 1440, height: 900 } }], ["390", { ...devices["iPhone 13"] }]]) {
  const ctx = await b.newContext(opts);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("diamentory.cart.v1", JSON.stringify([{ slug: "onyx-square-locket", variantId: "onyx-square-locket--gold", qty: 1, priceAtAdd: 5200 }]));
    } catch {}
  });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2000);
  for (const id of SECTIONS) {
    const y = await p.evaluate((id) => {
      const s = document.getElementById(id)?.closest("section");
      return s ? s.getBoundingClientRect().top + scrollY : -1;
    }, id);
    if (y < 0) continue;
    const cur = await p.evaluate(() => scrollY);
    for (let s = cur; s < y - 10; s += 120) {
      await p.mouse.wheel(0, 120);
      await p.waitForTimeout(20);
    }
    if (w === "390") await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/${tag}-${w}-${id.replace("-title", "")}.png` });
  }
  for (const path of PAGES) {
    await p.goto(base + path, { waitUntil: "load", timeout: 90000 });
    await p.waitForTimeout(2200);
    await p.screenshot({ path: `${out}/${tag}-${w}-${path.slice(1).replace(/\//g, "_")}.png` });
  }
  await ctx.close();
}
await b.close();
console.log("saved to", out);
