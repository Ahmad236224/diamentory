// Which elements shift during load? node cls-sources.mjs <path> <w> <h>
import { chromium } from "@playwright/test";
const [, , path = "/checkout", w = "768", h = "1024"] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h } });
await ctx.addInitScript(() => {
  localStorage.setItem("diamentory.cart.v1", JSON.stringify([{ slug: "onyx-square-locket", variantId: "onyx-square-locket--gold", qty: 1, priceAtAdd: 5200 }]));
  window.__shifts = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({ v: +e.value.toFixed(3), t: Math.round(e.startTime), src: e.sources.map((s) => { const n = s.node; return n ? `${n.nodeName}.${(n.className?.baseVal ?? n.className ?? "").toString().slice(0, 70)} ${JSON.stringify(s.previousRect?.y)}→${JSON.stringify(s.currentRect?.y)} h${s.previousRect?.height}→${s.currentRect?.height}` : "?"; }) });
    }
  }).observe({ type: "layout-shift", buffered: true });
});
const p = await ctx.newPage();
await p.goto("http://localhost:3217" + path, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(() => window.__shifts), null, 1));
await b.close();
