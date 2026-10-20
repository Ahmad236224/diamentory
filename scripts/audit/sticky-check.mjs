// Scroll the shop on a phone; header must stay at top and the filter bar must sit flush under it.
import { chromium, devices } from "@playwright/test";
const out = process.argv[2];
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices["iPhone 13"] })).newPage();
await p.goto((process.env.BASE ?? "http://localhost:3217") + "/shop", { waitUntil: "networkidle" });
for (const frac of [0.35, 0.7, 0.92]) {
  await p.evaluate((f) => scrollTo(0, document.documentElement.scrollHeight * f), frac);
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const h = document.querySelector("header").getBoundingClientRect();
    const fb = document.querySelector("[class*='top-[var(--header-h)]']")?.getBoundingClientRect();
    return { headerTop: Math.round(h.top), headerBottom: Math.round(h.bottom), filterTop: fb ? Math.round(fb.top) : null };
  });
  console.log(frac, JSON.stringify(r));
  await p.screenshot({ path: `${out}/sticky-${frac}.png` });
}
await b.close();
