# Diamentory — delivery status

_Frontend phase, October 2026._

## Fully functional now (frontend)

- **Homepage**: the full nine-section editorial sequence:
  hero → categories → signature selection → statement → explore by finish → new arrivals → brand story → styled moments → final statement.
- **Catalogue pages**: Shop All, Chains & Necklaces, Bracelets, Rings, Pendants, Sets & Stacks, New Arrivals, Collections (index plus Gold / Silver / Black / Two-Tone) and Search.
  - Search, finish and category filters, in-stock toggle, sorting and "Load more" all work.
  - Product counts are accurate.
  - Filter state lives in the URL, so it can be shared and crawled.
  - On mobile, filters open in a bottom sheet.
- **Product pages**:
  - Swipeable mobile gallery showing image counts, and an enlarged viewer with zoom.
  - Finish and size selection, with sold-out options and sold-out combinations handled.
  - Stock messaging, quantity, Add to bag and Buy now.
  - Sticky mobile buy bar with a bottom-sheet size picker.
  - Complementary products and recently viewed.
  - Breadcrumbs, plus Product and BreadcrumbList JSON-LD.
- **Bag**: drawer and full page.
  - Quantity changes and removal.
  - Price-change and stock-issue warnings.
  - Saved in the browser (localStorage).
- **Checkout**: guest checkout with full validation.
  - Pakistani mobile number format, province list, error summary and focus management.
  - Draft survives a page refresh (sessionStorage).
  - Delivery method and payment choice (cash on delivery / bank transfer).
- **Other pages**: Track Order form, Contact, Shipping, Returns, FAQ (with FAQPage JSON-LD), Privacy, Terms, Our Story, Lookbook, and custom 404 and error pages.
- **SEO and accessibility**:
  - Unique metadata and canonical URLs per page, OpenGraph tags, sitemap.xml and robots.txt.
  - Skip link, visible focus, native `<dialog>` modals (focus trapping, Esc to close), touch targets of at least 44px.
  - Respects `prefers-reduced-motion`; no horizontal overflow down to 320px.

## Honest placeholders — nothing is simulated

- **Product data is sample data** (`src/lib/catalog/fixtures.ts`), and a site-wide banner says so.
  - Product images are original illustrations, not photographs.
  - Materials, dimensions and care text are not shown; the product page says "to be confirmed".
- **Placing an order is not live yet.** `submitOrder()` in `src/lib/checkout/submit.ts` always returns `unavailable`.
  - The customer sees a clear message that no order was placed and no payment was taken.
  - They can copy their order summary or send it via Instagram.
- **Order tracking** validates its form, then explains that tracking opens when online ordering launches.
- **Business facts are shown as "To be confirmed"** until provided: delivery fee and times, return window, email, phone, WhatsApp, opening hours and bank details.
- **Privacy and Terms** are structured drafts marked "pending review".

## Awaiting your input

1. Logo files, product photography and editorial/lookbook images. Put them in `brand-assets/`.
2. The real catalogue: names, categories, finishes, sizes, PKR prices and stock. Add materials, dimensions and care only where they are verified.
3. Business details: delivery fees, courier and delivery times, return/exchange policy, contact details, bank account for transfers.
4. Payment gateway choice and merchant credentials (Safepay, PayFast, etc.).
5. Production domain. Set `NEXT_PUBLIC_SITE_URL`.
6. Legal review of the Privacy and Terms pages.

## Next phase: backend

- Postgres with Prisma: products, variants and inventory, plus orders.
- Server-side order creation that is idempotent and re-checks prices and stock on the server.
- Cash on delivery and bank transfer workflows.
- Gateway adapter with webhook verification.
- Order confirmation page and email.
- Admin area: products, photos, variants, inventory, orders, delivery charges, coupons, homepage features, and reports.
- Playwright end-to-end test suite in CI.
- Lighthouse audits on a production-like deployment.
