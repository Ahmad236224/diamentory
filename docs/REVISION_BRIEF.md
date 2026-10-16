# DIAMENTORY — client revision brief (Oct 2026)

Read with `docs/BUILD_BRIEF.md` and `AGENTS.md` (Next 16.4 + Cache Components; read `node_modules/next/dist/docs/` when unsure). **This brief overrides older guidance where they differ.**

## Client feedback to fix
- The site does not feel consistent: margins, padding, alignment, card sizes, type and buttons vary.
- New authentic product photographs must be used.
- Premium, modern animations wanted.
- **Exactly three top-level categories: Rings · Chain & Lockets · Bracelets** (in that order, everywhere).

## Decisions already made (don't revisit)
- **Fonts**: Unbounded 600 (display; `font-serif` / `.display` / `.t-*` classes, uppercase for display sizes, `<em>` = weight 300) + Manrope (all UI/body/prices/forms). Tested against Archivo Expanded and Syne with the new photos.
- **Colour**: black & white dominant; electric blue `--accent` only for small index tags (`.tag`) and focus rings. No other accent.
- **Categories**: slugs `rings`, `chains` (displayed as "Chain & Lockets"), `bracelets`. `CATEGORIES` in `@/lib/catalog` is the single source. Styles (subcategories) are filters: `?style=<slug>` (`stylesOf`, `styleSlug`, `parseStyleParam`, `Query.style`). Old `/shop/pendants` → `/shop/chains?style=locket`, `/shop/sets` → `/shop`, retired product slugs → redirects (in next.config.ts — done).
- **Catalogue**: `src/lib/catalog/fixtures.ts` now maps every product to genuine photos (client studio shots in `/images/products/`, Instagram frames in `/images/brand/`). Prices/sizes/stock are still SAMPLE → keep the preview notice. No product without a real photo.
- **Photos**: studio frames are 768×1376 (9:16). Each `ProductImage` has `focus` (object-position) — always honour it. `ProductMedia` picks finish-specific photos (`photosFor`). Never upscale: don't render a studio frame larger than ~800 CSS px wide on desktop (use it in columns, not full-bleed 1440 heroes — full-bleed only on mobile). Brand Instagram frames ≤720px wide: use only at small/medium sizes. Licensed Pexels images (`kind: "editorial"` in `src/content/images.ts`) only for non-product mood moments.
- **There are NO studio bracelet photos.** Bracelets use the Instagram bracelet frames (`brand-iced-cuban-bracelet-wrist/fist`, `brand-cuban-bracelets-hand`, `brand-iced-link-bracelets-wrist`).

## Design tokens (src/app/globals.css — use these, don't hardcode)
- Layout: `.wrap` (container: max 1560px + gutters 18/28/48/72px) — **replaces every `gutter mx-auto max-w-[1800px]`**. `.section` (64/96/128px block padding), `.section-sm` (40/56/72). `.grid-12` + `gap` var `--grid-gap` (12/20/24).
- Type: `.t-hero`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead`, `.t-small`, `.eyebrow`, `.wordmark`. Body default 15px/1.6. Don't invent new clamp() sizes per section — pick from the scale.
- Buttons: `.btn` + `.btn-dark` | `.btn-light` | `.btn-outline` | `.btn-outline-light` (48px, uppercase 11px tracking). Replace ad-hoc button classes.
- Ratios: `.ratio-card` (3:4 — ALL product cards), `.ratio-portrait` (4:5), `.ratio-tall` (9:16), `.ratio-square`, `.ratio-wide`.
- Borders: hairline `border-obsidian/10` (light) / `border-ivory/15` (dark).
- Motion: `--dur-1..4`, `--ease-out`, `--ease-inout`.

## Motion system (already built)
`<RevealObserver/>` (root layout) adds `.is-in` on scroll for: `.reveal` (fade-up), `.reveal-mask` (image wipe + settle; put it on the image frame wrapper), `.reveal-stagger` (children cascade). Optional delay `style={{ "--d": "120ms" }}`. `.drift` on an `overflow-hidden` frame gives a subtle transform-only image drift (replaces old `.parallax-img`). Load animations: `.mask-line > span` (headline lines), `.fade-in`, `.clip-in`. Reduced motion is handled globally. Use transform/opacity only; never block interaction; nothing longer than ~1.2s.

## QA
Dev server: http://localhost:3217 (running; don't restart unless needed; never run `next build` — I will). Screenshot helpers: `scripts/shot.mjs`, `scripts/home-shots.mjs` (tiles, reduced motion), `scripts/home-qa.mjs` (all widths + overflow + clipped headings + interactions). Scratchpad for screenshots: `C:\Users\Welcome\AppData\Local\Temp\claude\g--Projects-diamentory\349db7c1-b26e-44cb-bd84-3fa29c70a164\scratchpad\`. Test 320, 360, 375, 390, 414, 430, 768, 1024, 1440, 1920. Read every screenshot and critique honestly. `npx tsc --noEmit` and `npx eslint <your files>` clean. Do not commit or push.
