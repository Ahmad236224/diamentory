// Homepage QA: overflow/errors at all target widths + key mobile interactions.
import { chromium, devices } from "@playwright/test";
const out = process.argv[2];
const b = await chromium.launch();
for (const w of [320, 360, 375, 390, 414, 430, 768, 1024, 1440, 1920]) {
  const p = await b.newPage({ viewport: { width: w, height: w < 768 ? 800 : 1000 } });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:3217/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1600);
  const r = await p.evaluate(() => {
    const ov = document.documentElement.scrollWidth - innerWidth;
    // text overflowing its section horizontally
    const clipped = [...document.querySelectorAll("h1,h2")].filter((h) => h.scrollWidth > h.clientWidth + 2).map((h) => h.textContent.trim().slice(0, 20));
    const hero = document.querySelector("#hero-title").getBoundingClientRect();
    const cta = [...document.querySelectorAll("a")].find((a) => a.textContent.trim().startsWith("Shop all"))?.getBoundingClientRect();
    return { ov, clipped, ctaVisible: cta ? cta.bottom <= innerHeight : false, heroTop: Math.round(hero.top) };
  });
  if ([320, 1024, 1920].includes(w)) await p.screenshot({ path: `${out}/hv-${w}.png` });
  console.log(w, JSON.stringify(r), errs.length ? errs.slice(0, 2) : "");
  await p.close();
}
// interactions on a touch phone
const ctx = await b.newContext({ ...devices["iPhone 13"] });
const p = await ctx.newPage();
await p.goto("http://localhost:3217/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Open menu" }).tap();
await p.waitForTimeout(700);
console.log("menu open:", await p.getByRole("dialog", { name: "Menu" }).isVisible());
await p.getByRole("button", { name: "Close menu" }).tap();
await p.waitForTimeout(500);
await p.getByRole("button", { name: "Search" }).tap();
await p.waitForTimeout(500);
console.log("search quick links:", await p.getByRole("dialog", { name: "Search" }).getByRole("link").allTextContents());
await p.getByRole("button", { name: "Close search" }).tap();
const tabs = p.getByRole("tab");
await tabs.nth(1).tap();
console.log("tab selected:", await tabs.nth(1).getAttribute("aria-selected"), await tabs.nth(1).textContent());
await tabs.nth(1).focus(); await p.keyboard.press("ArrowRight");
console.log("arrow key moves to:", await p.evaluate(() => document.activeElement?.textContent));
const panel = p.getByRole("tabpanel").filter({ visible: true }).first();
await panel.getByRole("button", { name: /Quick add/ }).first().tap();
await p.waitForTimeout(600);
const sheet = p.getByRole("dialog", { name: /Quick view/ });
const sizeLabel = sheet.locator("fieldset").nth(1).locator("label:not(.line-through)").first();
if (await sizeLabel.count()) await sizeLabel.tap();
await sheet.getByRole("button", { name: "Add to bag" }).tap();
await p.waitForTimeout(700);
console.log("drawer open:", await p.getByRole("dialog", { name: "Bag" }).isVisible(), "highlighted lines:", await p.locator("dialog li.line-new").count());
await p.waitForTimeout(200);
console.log("bag label:", await p.getByRole("button", { name: /^Bag,/ }).getAttribute("aria-label"));
await p.screenshot({ path: `${out}/hv-quickadd.png` });
await p.keyboard.press("Escape");
await p.waitForTimeout(150);
console.log("count bump after close:", await p.locator("header .bump").count());
const strip = p.getByRole("list", { name: "Chain & Lockets, as worn" });
await strip.scrollIntoViewIfNeeded();
const before = await strip.evaluate((e) => e.scrollLeft);
await strip.evaluate((e) => e.scrollBy({ left: 300 })); await p.waitForTimeout(500);
console.log("strip swipes:", before, "->", await strip.evaluate((e) => e.scrollLeft));
await p.goto("http://localhost:3217/");
await p.getByRole("link", { name: /Shop all/ }).first().tap();
await p.waitForURL("**/shop"); console.log("hero CTA ->", new URL(p.url()).pathname);
await p.goto("http://localhost:3217/");
const style = p.getByRole("navigation", { name: "Chain styles" }).getByRole("link", { name: "Rope" });
await style.scrollIntoViewIfNeeded(); await style.tap();
await p.waitForURL("**/shop/chains?style=rope"); console.log("style link ->", p.url().replace("http://localhost:3217", ""));
await b.close();
