# DIAMENTORY — build brief (frontend phase)

Luxury, design-led jewellery storefront. Contemporary luxury meets sculptural fashion editorial.
References for *feel* only (never copy): tomwoodproject.com, vitalydesign.com, clocksandcolours.com, miansai.com.
It must NOT look like a Shopify theme. Mobile (320–430px) is the primary design target.

## Stack & framework gotchas
- Next.js **16.4** App Router with `cacheComponents: true`. Read `node_modules/next/dist/docs/` before using an API you're unsure of.
  - `searchParams` / `cookies()` / `headers()` must be read inside a component wrapped in `<Suspense>`; page shells must stay static.
  - `useSearchParams()` always needs a `<Suspense>` boundary.
  - Dynamic routes: `generateStaticParams` must return ≥1 param; do NOT export `dynamicParams`. Unknown slug → `notFound()`.
  - `new Date()` in server components needs `"use cache"` (see SiteFooter).
  - `params` / `searchParams` are Promises.
- Tailwind v4 (tokens in `src/app/globals.css` `@theme`). `motion` is installed but prefer CSS (`.reveal`, `.mask-line`, `.clip-in`, `.parallax-img`, `.stagger`) — minimal client JS.
- Dev server is ALREADY running at http://localhost:3217 — do not start another, do not run `next build`.
- Screenshot QA: `MSYS_NO_PATHCONV=1 node scripts/shot.mjs <path> <width> <out.png> [full=1] [height]` (prints horizontal overflow + console errors). Then Read the PNG and look at it critically. Check 375 and 1440 widths at minimum (also 320).

## Design tokens (use these, no new colours)
- `obsidian #101010`, `graphite #33312F`, `champagne #D2C6B5`, `ivory #F2EFE9` (page bg), `stone #8A847B` (muted text), `line`, `error`, `success`.
- Fonts: `font-serif` = Bodoni Moda (editorial display headlines, sparingly, often with *italic* accents); `font-sans` = Inter Tight (UI, product info, checkout).
- Utility classes: `.eyebrow` (tiny tracked caps labels), `.display`, `.wordmark`, `.gutter` (side padding), `.link-line` (underline anim), `.prose-legal`, `.skeleton`, `.safe-bottom`, `.no-scrollbar`.
- Square corners. Hairline borders (`border-obsidian/10`). No gradients on UI, no glow, no gold ornament, no fake badges. Whitespace + composition + type do the work.
- Buttons: primary `bg-obsidian text-ivory eyebrow min-h-12`; secondary `border border-obsidian`. Touch targets ≥ 44px.
- Max content width `max-w-[1800px] mx-auto`. Header height var `--header-h`.

## Data — single source of truth
- `@/lib/catalog` (`getAllProducts`, `getProduct`, `queryProducts`, `CATEGORIES`, `FINISHES`, `priceRange`, `productFinishes`, `isSoldOut`, `getComplementary`, `SORT_OPTIONS`, `parseFinishParam`, `parseSortParam`, `USING_FIXTURES`).
- Products are **development fixtures** (flagged `isFixture`). Never invent materials, metal purity, plating, stone specs, dimensions, care, ratings, reviews, "bestseller" claims, testimonials, press quotes, warranties or business policies. Only render `materials`/`dimensions`/`care` if present.
- Business facts (`@/content/site` `BUSINESS`) are `pending` — render with a visible "To be confirmed" treatment, never invent numbers (delivery fee, return window, phone, email…).
- Prices: `formatPrice` / `formatPriceRange` from `@/lib/format` (PKR).

## Imagery
- No real photography yet. Use `<ProductMedia product finish view tone sizes priority />` for products and `<JewelArt form finish view tone crop rotate />` for art-directed editorial crops (viewBox 1000×1250; `crop=[x,y,w,h]` zooms; `tone` ivory|stone|dark; `view` 0 full,1 detail,2 angled,3 dark).
- Always reserve aspect ratio (no CLS). Editorial "photography pending" moments may use JewelArt macro crops on dark tone — they look intentional, like still-life studies.

## Shared components (reuse, don't duplicate)
- `ProductCard` (server; includes QuickView quick-add), `ProductMedia`, `PurchasePanel` + `useVariantSelection` (finish/size/qty/stock/add/buy-now), `QuickView`, `Dialog` (native `<dialog>`, sides left/right/bottom/top/center), `QtyStepper`, icons in `@/components/ui/icons`, `useCart()` (lines, count, subtotal, hasIssues, add, setQty, remove, clear, open/close).
- Layout (header, footer, cart drawer, fixture notice) is already in `src/app/layout.tsx`.

## Shared-file rules
- You own only the files listed in your task. If you must change a shared file (`globals.css`, `lib/catalog/*`, `content/site.ts`, `components/product/*`, `components/ui/*`, `components/cart/*`), make a minimal additive `Edit` (never rewrite the file) and mention it in your report.
- Append CSS only at the end of `globals.css` inside a `/* ── <area> ── */` section.

## Every page
- Unique `metadata` (title, description, `alternates.canonical`), one `<h1>`, semantic landmarks, visible focus, labelled controls, no hover-only functionality, no dead links/buttons, `prefers-reduced-motion` respected (CSS already handles global classes).
