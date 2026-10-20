# Diamentory — delivery status

_Public storefront, updated 19 October 2026. Read with `docs/REVISION_BRIEF.md`._

## Live and working (frontend)

- **Three categories everywhere**: Rings · Chain & Lockets · Bracelets (`CATEGORIES` in `src/lib/catalog`). Styles (Cuban link, locket, rope, band, statement…) are filters (`?style=`), not categories. Retired URLs (`/shop/pendants`, `/shop/sets`, old product slugs) redirect.
- **Catalogue**: 20 products, every one shown in Diamentory's own photographs: 17 studio frames in `public/images/products/`, plus Instagram frames in `public/images/brand/` (bracelets have no studio shots yet). Licensed Pexels images are used only for mood moments, never as products.
- **Shop**: search, category/style/finish filters, in-stock toggle, sorting, load more, filter state in the URL, bottom-sheet filters on phones.
- **Product pages**: swipeable gallery and zoom viewer, finish and size selection, sold-out handling, quantity, Add to bag / Buy now, sticky mobile buy bar, "Wear it with" products, recently viewed, breadcrumbs.
- **Bag**: drawer and full page, saved in the browser.
- **Checkout**: guest checkout with full validation (Pakistani mobile format, province list, error summary, focus management), draft kept on refresh.
- **Design system**: Unbounded (display) + Manrope (text); black and white with one electric-blue accent for index tags and focus rings; tokens for gutters, sections, grid, type, buttons and image ratios in `src/app/globals.css`.
- **Motion**: hero image wipes, headline line reveals, scroll reveals and image masks, drawer/menu/sheet transitions, button and add-to-bag feedback, route crossfade (View Transitions). All of it is off under reduced motion.
- **SEO and accessibility**: per-page titles, canonicals and OpenGraph images (genuine photos); sitemap.xml and robots.txt; Product + BreadcrumbList + FAQPage JSON-LD; skip link, visible focus, native dialogs, 44px+ touch targets.

## Clearly marked as not live (nothing is simulated)

- **Prices, sizes/lengths and stock are SAMPLE values** (`src/lib/catalog/fixtures.ts`, `isFixture: true`). A site-wide banner says so. While products are fixtures, product structured data omits price/availability, so search engines never index sample prices.
- **Placing an order is not live.** `submitOrder()` (`src/lib/checkout/submit.ts`) returns `unavailable`. The customer is told no order was placed and no payment was taken. There is no order confirmation page yet.
- **Order tracking** validates the form, then explains that tracking opens with online ordering.
- **Business facts show "To be confirmed"**: delivery fee and times, return window, contact details, bank details.
- **Privacy and Terms** are drafts pending review.

## Needed from the client

1. The real catalogue: product names, PKR prices, sizes/lengths, stock, plus materials and care only where verified.
2. Studio photos of the bracelets (currently Instagram frames, max ~720px wide), and higher-resolution originals of the studio shots if available (current files are 768×1376).
3. Business details: delivery fees, courier and times, return/exchange policy, phone/WhatsApp/email, bank account for transfers.
4. Payment gateway choice and merchant credentials (e.g. Safepay, PayFast), or confirmation that it's cash on delivery plus bank transfer only.
5. Production domain (`NEXT_PUBLIC_SITE_URL`). Canonicals, sitemap and OG URLs depend on it.
6. Legal review of Privacy and Terms.

## Backend (parked on local branch `admin-backend-wip`)

Database, real order creation, admin (products, inventory, orders) are in progress on that branch. Before it can be merged it needs Neon Postgres, Vercel Blob and the admin env vars.
