// Shop/product interaction QA: style filter, finish → photo switch, add to bag feedback, sticky buy bar, redirects.
// Usage: node scripts/qa-shop-interact.mjs <outDir>
import { chromium, devices } from "@playwright/test";
const out = process.argv[2];
const base = "http://localhost:3217";
const b = await chromium.launch();

// ── Desktop: style chip filters the grid, URL updates, counts match
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/shop/chains", { waitUntil: "networkidle" });
  const before = await p.locator("ul.product-grid > li").count();
  await p.getByRole("group", { name: "Style" }).getByRole("link", { name: /^Locket/ }).click();
  await p.waitForURL("**/shop/chains?style=locket");
  await p.waitForTimeout(800);
  const after = await p.locator("ul.product-grid > li").count();
  const label = await p.locator("p[aria-live=polite]").filter({ visible: true }).first().textContent();
  console.log("desktop style filter:", before, "->", after, "| count label:", label, "| url:", new URL(p.url()).search);
  await p.screenshot({ path: `${out}/i-style-desktop.png` });
  // finish switch on onyx locket → gallery photos change
  await p.goto(base + "/product/onyx-square-locket", { waitUntil: "networkidle" });
  const srcs = () => p.locator("[aria-label='Onyx Square Locket images'] img").evaluateAll((els) => els.map((e) => decodeURIComponent(e.currentSrc || e.src).match(/products\/([^&?]+)/)?.[1]));
  const gold = await srcs();
  await p.locator("fieldset").first().getByText("Silver").click();
  await p.waitForTimeout(900);
  const silver = await srcs();
  console.log("finish switch gold:", gold, "silver:", silver);
  await p.screenshot({ path: `${out}/i-onyx-silver-1440.png` });
  // zoom viewer opens and has correct count
  await p.locator("[aria-label='Onyx Square Locket images'] button").first().click();
  await p.waitForTimeout(700);
  console.log("viewer open:", await p.getByRole("dialog", { name: /image viewer/ }).isVisible());
  await p.screenshot({ path: `${out}/i-viewer-1440.png` });
  await p.close();
}

// ── Phone
{
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  await p.goto(base + "/shop/pendants", { waitUntil: "networkidle" });
  console.log("redirect /shop/pendants ->", new URL(p.url()).pathname + new URL(p.url()).search,
    "| locket chip pressed:", await p.getByRole("navigation", { name: "Quick style filter" }).getByRole("link", { name: /^Locket/ }).getAttribute("aria-pressed"));
  // mobile sheet: choose a style and apply
  await p.goto(base + "/shop/rings", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: /Filter & sort/ }).tap();
  await p.waitForTimeout(600);
  const sheet = p.getByRole("dialog", { name: "Filter and sort" });
  await sheet.getByText(/^Statement/).tap();
  const btn = await sheet.getByRole("button", { name: /^Show/ }).textContent();
  await p.screenshot({ path: `${out}/i-sheet-375.png` });
  await sheet.getByRole("button", { name: /^Show/ }).tap();
  await p.waitForURL("**style=statement");
  await p.waitForTimeout(700);
  console.log("sheet apply:", btn, "->", new URL(p.url()).search, "cards:", await p.locator("ul.product-grid > li").count());

  // product page: add to bag shows "Added ✓", then the drawer opens
  await p.goto(base + "/product/cuban-link-chain", { waitUntil: "networkidle" });
  await p.locator("fieldset").nth(1).locator("label:not(.line-through)").first().tap();
  const add = p.getByRole("button", { name: /Add to bag/ }).first();
  await add.tap();
  await p.waitForTimeout(150);
  const mid = await p.locator("button:has-text('Added')").count();
  await p.screenshot({ path: `${out}/i-added-375.png` });
  await p.waitForTimeout(1100);
  const drawer = await p.locator("dialog[open]").count();
  console.log("add to bag: 'Added' shown:", mid > 0, "| dialog open after:", drawer > 0);
  await p.screenshot({ path: `${out}/i-drawer-375.png` });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
  // sticky buy bar after scrolling past the CTA
  await p.evaluate(() => window.scrollTo(0, 1400));
  await p.waitForTimeout(900);
  const bar = p.locator("div.fixed.inset-x-0.bottom-0").first();
  console.log("sticky bar visible:", await bar.evaluate((e) => getComputedStyle(e).visibility));
  await p.screenshot({ path: `${out}/i-sticky-375.png` });
  // redirects
  for (const u of ["/shop/sets", "/product/tennis-chain"]) {
    await p.goto(base + u, { waitUntil: "domcontentloaded" });
    console.log("redirect", u, "->", new URL(p.url()).pathname + new URL(p.url()).search);
  }
  await ctx.close();
}
await b.close();
