# Diamentory — online store

Flagship e-commerce site for DIAMENTORY, a fashion-led jewellery label (chains, bracelets, rings, pendants, sets) selling in Pakistan (PKR).

**Status: frontend phase.** The storefront runs on clearly marked *development fixtures* (sample products, prices and illustrated imagery). Ordering, payments, admin and database arrive in the backend phase — see `docs/STATUS.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

- `src/app/` — routes (Next.js 16 App Router, Cache Components)
- `src/lib/catalog/` — the single catalogue source (`fixtures.ts` is sample data to be replaced)
- `src/content/site.ts` — brand & business facts (pending items are shown as “to be confirmed”)
- `src/components/` — art (illustrated placeholders), layout, product, catalog, cart, checkout, home
- `brand-assets/` — drop folder for the real logo, photography and catalogue
- `docs/BUILD_BRIEF.md` — design system and engineering conventions
- `scripts/shot.mjs` — screenshot + overflow checker used for responsive QA
