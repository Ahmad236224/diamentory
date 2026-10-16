// Shop/product/content QA: screenshots + overflow + clipped headings + console errors.
// Usage: node scripts/qa-shop.mjs <outDir> <widths comma> <path> [path...]
//   env FULL=0 → first viewport only; env TAG=suffix for file names
import { chromium } from "@playwright/test";
const [, , out, widthsArg, ...paths] = process.argv;
const widths = widthsArg.split(",").map(Number);
const base = process.env.BASE ?? "http://localhost:3217";
const full = process.env.FULL !== "0";
const b = await chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({
    viewport: { width: w, height: w < 768 ? 812 : 900 },
    reducedMotion: process.env.MOTION === "1" ? "no-preference" : "reduce",
    hasTouch: w < 768,
    isMobile: w < 768,
  });
  for (const path of paths) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    const res = await p.goto(base + path, { waitUntil: "networkidle", timeout: 120000 });
    await p.waitForTimeout(900);
    if (full) {
      // walk the page so lazy images + reveals load
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await p.waitForTimeout(700);
    }
    const r = await p.evaluate(() => {
      const ov = document.documentElement.scrollWidth - innerWidth;
      const clipped = [...document.querySelectorAll("h1,h2,h3")]
        .filter((h) => h.offsetParent && h.scrollWidth > h.clientWidth + 2)
        .map((h) => h.textContent.trim().slice(0, 24));
      const wide = [...document.querySelectorAll("*")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest("[class*=overflow-x-auto],[class*=overflow-hidden],dialog"))
        .slice(0, 4)
        .map((e) => e.tagName + "." + String(e.className).slice(0, 50));
      return { iw: innerWidth, ov, clipped, wide };
    });
    const name = `${path.replace(/[/?=&]+/g, "_").replace(/^_/, "") || "home"}-${w}${process.env.TAG ?? ""}.png`;
    await p.screenshot({ path: `${out}/${name}`, fullPage: full });
    console.log(w, path, res?.status(), new URL(p.url()).pathname + new URL(p.url()).search, JSON.stringify(r), errs.length ? errs.slice(0, 3) : "");
    await p.close();
  }
  await ctx.close();
}
await b.close();
