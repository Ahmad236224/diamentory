import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterBar } from "./FilterBar";
import { ListingFrame, PendingArea } from "./ListingFrame";
import { LoadMore } from "./LoadMore";
import {
  appliedCount,
  CLEARED,
  listingHref,
  parseListingState,
  runListing,
  PAGE_SIZE,
  type ListingConfig,
  type SearchParams,
} from "./listingState";

/** Shared product grid: 2 / 3 / 4 columns, `--grid-gap` gutters (see globals.css "Shop & product pages"). */
export const PRODUCT_GRID = "product-grid";
export const GRID_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const GRID = PRODUCT_GRID;
const SIZES = GRID_SIZES;

/** Server-rendered, URL-driven product listing. Must be rendered inside <Suspense>. */
export async function Listing({
  config,
  searchParams,
}: {
  config: ListingConfig;
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const state = parseListingState(sp, config);
  const results = runListing(config, state);
  const shown = results.slice(0, state.n);
  const more = results.length > shown.length ? listingHref(config, state, { n: state.n + PAGE_SIZE }) : null;
  const cardFinish = config.finish ?? (state.finishes.length ? state.finishes[0] : undefined);

  if (config.search && !state.q) return <SearchPrompt />;

  return (
    <ListingFrame>
      {(results.length > 0 || appliedCount(state) > 0) && (
        <FilterBar config={config} state={state} total={results.length} />
      )}
      <PendingArea className="wrap pt-8 pb-[var(--section-y)] lg:pt-10">
        {shown.length ? (
          // keyed by the filter signature: a new result set fades in; "load more" (n) keeps the grid
          <div key={listingHref(config, { ...state, n: PAGE_SIZE })} className="results-fade">
            <ul className={`${GRID} reveal-stagger stagger-head`}>
              {shown.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} finish={cardFinish} sizes={SIZES} priority={i < 2} />
                </li>
              ))}
            </ul>
            {results.length > PAGE_SIZE && <LoadMore href={more} shown={shown.length} total={results.length} />}
          </div>
        ) : (
          <Empty
            title={state.q && appliedCount(state) === 0 ? `Nothing found for “${state.q}”` : "Nothing matches these filters"}
            body={
              state.q && appliedCount(state) === 0
                ? "Check the spelling, or try a broader word — a style like “cuban”, “locket” or “band”, or a finish like “gold” or “silver”."
                : "Try removing a filter or two — the piece you are after may be one step away."
            }
            reset={
              appliedCount(state) > 0
                ? { href: listingHref(config, state, CLEARED), label: "Clear filters" }
                : null
            }
          />
        )}
      </PendingArea>
    </ListingFrame>
  );
}

function Empty({ title, body, reset }: { title: string; body: string; reset: { href: string; label: string } | null }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center lg:py-20">
      <p className="eyebrow text-stone">No results</p>
      <h2 className="t-h3 mt-4 text-balance">{title}</h2>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-graphite">{body}</p>
      <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        {reset && (
          <Link href={reset.href} scroll={false} className="btn btn-dark">
            {reset.label}
          </Link>
        )}
        <Link href="/shop" className="btn btn-outline">
          Shop all
        </Link>
      </div>
      <CategoryLinks className="mt-14" />
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="wrap border-t border-obsidian/10 pt-10 pb-[var(--section-y)]">
      <p className="text-[0.9375rem] text-graphite">Type a word above — a form, a finish or a name.</p>
      <CategoryLinks className="mt-10" align="start" />
    </div>
  );
}

export function CategoryLinks({ className, align = "center" }: { className?: string; align?: "center" | "start" }) {
  return (
    <nav aria-label="Browse by category" className={className}>
      <p className={`eyebrow text-stone ${align === "center" ? "text-center" : ""}`}>Browse by category</p>
      <ul className={`mt-4 flex flex-wrap gap-2 ${align === "center" ? "justify-center" : ""}`}>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/shop/${c.slug}`}
              className="inline-flex min-h-11 items-center border border-obsidian/15 px-4 text-[0.8125rem] transition-colors hover:border-obsidian"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Static fallback that mirrors the listing layout (no CLS). */
export function ListingSkeleton({ quickChips = true }: { quickChips?: boolean }) {
  return (
    <div aria-hidden="true">
      <div className="border-y border-obsidian/10">
        <div className="wrap flex h-14 items-center justify-between lg:h-16">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-16" />
        </div>
        {quickChips && (
          <div className="wrap flex gap-2 overflow-hidden pb-3 lg:hidden">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-11 w-24 shrink-0" />
            ))}
          </div>
        )}
      </div>
      <div className="wrap pt-8 pb-[var(--section-y)] lg:pt-10">
        <div className={GRID}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <div className="skeleton ratio-card" />
              <div className="skeleton mt-3 h-3 w-3/4" />
              <div className="skeleton mt-2 h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
