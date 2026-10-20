// Compare element heights with JS disabled (server HTML) vs hydrated. Usage: node hydration-diff.mjs <path> <w> <h>
import { chromium } from "@playwright/test";
const [, , path = "/", w = "1024", h = "1366"] = process.argv;
const base = process.env.BASE ?? "http://localhost:3300";
const b = await chromium.launch();
const measure = async (js) => {
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const out = {};
    document.querySelectorAll("main *").forEach((el, i) => { if (i < 400) { const r = el.getBoundingClientRect(); out[i + " " + el.tagName + "." + String(el.className).slice(0, 60)] = Math.round(r.height); } });
    return out;
  });
  await ctx.close();
  return r;
};
const a = await measure(false), c = await measure(true);
for (const k of Object.keys(c)) if (a[k] !== undefined && Math.abs(a[k] - c[k]) > 40) console.log(k, a[k], "→", c[k]);
await b.close();
