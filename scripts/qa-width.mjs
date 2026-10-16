// Finds elements wider than a 375px mobile viewport (isMobile zoom-out culprits).
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
for (const path of process.argv.slice(2)) {
  const p = await ctx.newPage();
  await p.goto("http://localhost:3217" + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const W = 375;
    const out = [];
    for (const e of document.querySelectorAll("body *")) {
      const rc = e.getBoundingClientRect();
      if (rc.right > W + 1 && rc.width > 0) {
        let a = e.parentElement, clipped = false;
        while (a && a !== document.body) { const cs = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(cs.overflowX) && a.getBoundingClientRect().right <= W + 1) { clipped = true; break; } a = a.parentElement; }
        if (!clipped) out.push(e.tagName + "." + String(e.className).slice(0, 70) + " r=" + Math.round(rc.right));
      }
    }
    return { iw: innerWidth, sw: document.documentElement.scrollWidth, out: out.slice(0, 6) };
  });
  console.log(path, JSON.stringify(r));
  await p.close();
}
await b.close();
