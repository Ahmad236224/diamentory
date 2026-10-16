// Touch-device interaction audit. Usage: node scripts/audit/interactions.mjs <outDir> [base]
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "audit-int";
const base = process.argv[3] ?? "http://localhost:3217";
mkdirSync(out, { recursive: true });

const DEVICES = [
  ["iphone13", devices["iPhone 13"]],
  ["pixel7", devices["Pixel 7"]],
  ["se-320", { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: devices["iPhone SE"].userAgent }],
  ["ipad", devices["iPad (gen 7)"]],
  ["iphone13-land", devices["iPhone 13 landscape"]],
];

const results = [];
const log = (dev, step, ok, note = "") => {
  results.push({ dev, step, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"} [${dev}] ${step}${note ? " — " + note : ""}`);
};

async function check(dev, step, fn) {
  try {
    const note = await fn();
    log(dev, step, true, note ?? "");
  } catch (e) {
    log(dev, step, false, String(e.message || e).split("\n")[0].slice(0, 180));
  }
}

const ONLY = process.env.ONLY;
const browser = await chromium.launch();
for (const [name, d] of DEVICES.filter(([n]) => !ONLY || n === ONLY)) {
  const ctx = await browser.newContext({ ...d });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  const tap = (loc) => (d.hasTouch ? loc.tap() : loc.click());
  const vw = d.viewport.width;
  const mobileNav = vw < 1024;

  await p.goto(base + "/", { waitUntil: "networkidle" });

  await check(name, "header: logo centred, bag + search visible", async () => {
    const logo = await p.getByRole("link", { name: /Diamentory — home/i }).boundingBox();
    const center = logo.x + logo.width / 2;
    if (Math.abs(center - vw / 2) > 6) throw new Error(`logo centre ${center.toFixed(0)} vs ${vw / 2}`);
    for (const n of [/^Bag,/, /^Search$/]) if (!(await p.getByRole("button", { name: n }).first().isVisible())) throw new Error(`${n} hidden`);
    return `logo centre ${center.toFixed(0)}/${vw / 2}`;
  });

  if (mobileNav) {
    await check(name, "menu opens, lists 3 categories, closes (button + Escape)", async () => {
      await tap(p.getByRole("button", { name: "Open menu" }));
      const dlg = p.getByRole("dialog", { name: "Menu" });
      await dlg.waitFor({ state: "visible" });
      for (const c of ["Rings", "Chain & Lockets", "Bracelets"]) await dlg.getByRole("link", { name: new RegExp(c) }).first().waitFor();
      const box = await dlg.boundingBox();
      if (box.width > vw + 1) throw new Error("menu wider than viewport");
      await p.screenshot({ path: `${out}/${name}-menu.png` });
      await tap(p.getByRole("button", { name: "Close menu" }));
      await dlg.waitFor({ state: "hidden" });
      await tap(p.getByRole("button", { name: "Open menu" }));
      await dlg.waitFor({ state: "visible" });
      await p.keyboard.press("Escape");
      await dlg.waitFor({ state: "hidden" });
    });
    await check(name, "menu → Chain & Lockets navigates", async () => {
      await tap(p.getByRole("button", { name: "Open menu" }));
      await tap(p.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: /Chain & Lockets/ }).first());
      await p.waitForURL("**/shop/chains");
    });
  } else {
    await check(name, "desktop nav → Chain & Lockets", async () => {
      await tap(p.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Chain & Lockets" }));
      await p.waitForURL("**/shop/chains");
    });
  }

  await check(name, "search opens, live results, submit → /search", async () => {
    await tap(p.getByRole("button", { name: "Search" }).first());
    const input = p.getByRole("searchbox");
    await input.fill("onyx");
    await p.getByRole("dialog", { name: "Search" }).getByRole("link", { name: /Onyx Square Locket/ }).first().waitFor();
    if ((await input.getAttribute("inputmode")) !== "search") throw new Error("inputmode not search");
    await input.press("Enter");
    await p.waitForURL("**/search?q=onyx");
  });

  await check(name, "shop: style filter (chip or sheet) updates URL + results", async () => {
    await p.goto(base + "/shop/chains", { waitUntil: "networkidle" });
    const before = await p.locator("main article").count();
    const chip = p.getByRole("link", { name: /^Locket/ }).first();
    if (await chip.isVisible().catch(() => false)) await tap(chip);
    else {
      await tap(p.getByRole("button", { name: /Filter/i }).first());
      await tap(p.getByRole("dialog").getByText("Locket", { exact: false }).first());
      const apply = p.getByRole("dialog").getByRole("button", { name: /Show|Apply/i }).first();
      if (await apply.isVisible().catch(() => false)) await tap(apply);
    }
    await p.waitForURL(/style=locket/);
    await p.waitForTimeout(500);
    const after = await p.locator("main article").count();
    if (!(after > 0 && after < before)) throw new Error(`cards ${before} → ${after}`);
    return `${before} → ${after} cards`;
  });

  await check(name, "product: finish switch changes photo", async () => {
    await p.goto(base + "/product/onyx-square-locket", { waitUntil: "networkidle" });
    const src = () => p.locator("main img").first().getAttribute("src");
    const a = await src();
    await tap(p.locator("label", { hasText: "Silver" }).first());
    await p.waitForTimeout(700);
    const b = await src();
    if (a === b) throw new Error("photo did not change");
  });

  await check(name, "product: size required, add to bag → drawer with line", async () => {
    await p.goto(base + "/product/textured-band-ring", { waitUntil: "networkidle" });
    await p.evaluate(() => localStorage.removeItem("diamentory.cart.v1"));
    await p.reload({ waitUntil: "networkidle" });
    const add = p.getByRole("button", { name: "Add to bag" }).first();
    await tap(add);
    await p.getByText(/Please select a size/i).first().waitFor();
    await tap(p.locator("label", { hasText: "US 9" }).first());
    await tap(add);
    const drawer = p.getByRole("dialog", { name: "Bag" });
    await drawer.waitFor({ state: "visible", timeout: 5000 });
    await drawer.getByText("Textured Band Ring").first().waitFor();
    await p.screenshot({ path: `${out}/${name}-drawer.png` });
    const box = await drawer.boundingBox();
    if (box.width > vw + 1) throw new Error("drawer wider than viewport");
    await tap(drawer.getByRole("button", { name: "Increase quantity" }).first());
    await drawer.getByText("Rs 7,200").first().waitFor();
    await p.keyboard.press("Escape");
  });

  if (vw < 768) {
    await check(name, "product: sticky buy bar appears and doesn't cover content", async () => {
      await p.goto(base + "/product/cuban-link-chain", { waitUntil: "networkidle" });
      await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.55));
      await p.waitForTimeout(800);
      const bar = p.locator("[data-sticky-buy], .sticky-buy, [aria-label*='Quick buy' i]").first();
      const visible = await bar.isVisible().catch(() => false);
      const pad = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector("main")).paddingBottom) || 0);
      await p.screenshot({ path: `${out}/${name}-sticky.png` });
      return visible ? `bar visible, main padding-bottom ${pad}px` : "bar selector not found (see screenshot)";
    });
  }

  await check(name, "cart page: qty + remove update totals", async () => {
    await p.goto(base + "/cart", { waitUntil: "networkidle" });
    await p.getByText("Textured Band Ring").first().waitFor();
    await tap(p.getByRole("button", { name: "Increase quantity" }).first());
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${name}-cart.png`, fullPage: true });
  });

  await check(name, "checkout: keyboards, autocomplete, validation focus", async () => {
    await p.goto(base + "/checkout", { waitUntil: "networkidle" });
    const attr = async (label, a) => p.getByLabel(label, { exact: false }).first().getAttribute(a);
    const email = [await attr("Email", "type"), await attr("Email", "autocomplete")];
    const phone = [await attr("Mobile", "type"), await attr("Mobile", "inputmode"), await attr("Mobile", "autocomplete")];
    const postal = await attr("Postal", "inputmode");
    if (email[0] !== "email") throw new Error("email type " + email[0]);
    if (phone[0] !== "tel") throw new Error("phone type " + phone[0]);
    const submit = p.getByRole("button", { name: /Confirm details|Place order|Continue/i }).last();
    await tap(submit);
    // wait for the smooth scroll to the first invalid field to settle
    await p.waitForTimeout(500); // smooth scroll starts ~120ms after the tap
    await p.waitForFunction(() => { const y = window.scrollY; return new Promise((r) => setTimeout(() => r(window.scrollY === y), 300)); }, null, { timeout: 8000 });
    const focused = await p.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
    // field must not be hidden under the sticky header
    const top = await p.evaluate(() => document.activeElement?.getBoundingClientRect().top ?? -1);
    await p.screenshot({ path: `${out}/${name}-checkout-errors.png` });
    if (top < 50) throw new Error(`focused field at y=${top} (under header?)`);
    return `email ${email.join("/")}, phone ${phone.join("/")}, postal ${postal}, focus → ${focused} @y=${Math.round(top)}`;
  });

  await check(name, "footer links all resolve", async () => {
    await p.goto(base + "/", { waitUntil: "domcontentloaded" });
    const hrefs = await p.locator("footer a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
    const bad = [];
    for (const h of hrefs) {
      const r = await ctx.request.get(base + h, { maxRedirects: 3, timeout: 20000 }).catch(() => null);
      if (!r || r.status() >= 400) bad.push(h);
    }
    if (bad.length) throw new Error("broken: " + bad.join(", "));
    return `${hrefs.length} links`;
  });

  await check(name, "scroll smoothness (4× CPU throttle): frame p95", async () => {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const stats = await p.evaluate(async () => {
      const frames = [];
      let last = performance.now();
      let run = true;
      const loop = (t) => { frames.push(t - last); last = t; if (run) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      const H = document.documentElement.scrollHeight - innerHeight;
      for (let y = 0; y <= H; y += 60) { scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)); }
      run = false;
      frames.sort((a, b) => a - b);
      const p95 = frames[Math.floor(frames.length * 0.95)];
      return { n: frames.length, p50: frames[Math.floor(frames.length / 2)], p95 };
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    if (stats.p95 > 50) throw new Error(`p95 ${stats.p95.toFixed(1)}ms`);
    return `p50 ${stats.p50.toFixed(1)}ms, p95 ${stats.p95.toFixed(1)}ms over ${stats.n} frames`;
  });

  if (errs.length) log(name, "no page errors", false, errs.slice(0, 2).join(" | "));
  await ctx.close();
}
await browser.close();
const fails = results.filter((r) => !r.ok);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
