// Real LCP on a throttled phone (4x CPU, ~fast 4G). Usage: node scripts/audit/lcp.mjs <path> [runs=3]
import { chromium, devices } from "@playwright/test";
const [, , path = "/", runs = "3"] = process.argv;
const base = process.env.BASE ?? "http://localhost:3300";
const b = await chromium.launch();
for (let i = 0; i < +runs; i++) {
  const ctx = await b.newContext({ ...devices["Pixel 7"] });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await p.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), el: e.element ? e.element.tagName + "." + String(e.element.className).slice(0, 40) + " " + (e.url || "").split("url=")[1]?.split("&")[0]?.slice(0, 40) : "?" }); }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await p.goto(base + path, { waitUntil: "load" });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({ lcp: window.__lcp.at(-1), fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0) }));
  console.log(path, "FCP", r.fcp, "LCP", r.lcp?.t, r.lcp?.el);
  await ctx.close();
}
await b.close();
