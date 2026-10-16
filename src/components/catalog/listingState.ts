/**
 * URL-driven listing state, shared by server pages and client filter UI.
 * Pure functions only — safe to import on either side.
 */
import {
  CATEGORIES,
  queryProducts,
  parseFinishParam,
  parseSortParam,
  type CategorySlug,
  type Finish,
  type SortKey,
} from "@/lib/catalog";

export const PAGE_SIZE = 12;

export type SearchParams = Record<string, string | string[] | undefined>;

/** What a listing page is fixed to, plus which filters it exposes. */
export interface ListingConfig {
  basePath: string;
  category?: CategorySlug;
  finish?: Finish;
  newOnly?: boolean;
  /** Reads `q` from the URL (search page). */
  search?: boolean;
  allowCategory?: boolean;
  allowFinish?: boolean;
  defaultSort?: SortKey;
}

export interface ListingState {
  finishes: Finish[];
  category?: CategorySlug;
  inStock: boolean;
  sort?: SortKey;
  n: number;
  q: string;
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function parseListingState(sp: SearchParams, config: ListingConfig): ListingState {
  const n = parseInt(first(sp.n), 10);
  const cat = first(sp.category);
  return {
    finishes: config.allowFinish === false ? [] : parseFinishParam(sp.finish),
    category:
      config.allowCategory && CATEGORIES.some((c) => c.slug === cat) ? (cat as CategorySlug) : undefined,
    inStock: first(sp.stock) === "1",
    sort: parseSortParam(sp.sort),
    n: Number.isFinite(n) && n > PAGE_SIZE ? Math.min(Math.ceil(n / PAGE_SIZE) * PAGE_SIZE, 240) : PAGE_SIZE,
    q: config.search ? first(sp.q).trim().slice(0, 80) : "",
  };
}

export function runListing(config: ListingConfig, state: Omit<ListingState, "n">) {
  if (config.search && !state.q) return [];
  return queryProducts({
    category: config.category ?? state.category,
    finish: config.finish ? [config.finish] : state.finishes,
    newOnly: config.newOnly,
    inStock: state.inStock,
    q: state.q || undefined,
    sort: state.sort ?? config.defaultSort,
  });
}

/** Builds a canonical, shareable URL for a listing state. Filter changes reset pagination. */
export function listingHref(config: ListingConfig, state: ListingState, patch: Partial<ListingState> = {}) {
  const next = { ...state, ...patch };
  if (!("n" in patch)) next.n = PAGE_SIZE;
  const p = new URLSearchParams();
  if (config.search && next.q) p.set("q", next.q);
  if (next.category) p.set("category", next.category);
  if (next.finishes.length) p.set("finish", next.finishes.join(","));
  if (next.inStock) p.set("stock", "1");
  if (next.sort && next.sort !== (config.defaultSort ?? "featured")) p.set("sort", next.sort);
  if (next.n > PAGE_SIZE) p.set("n", String(next.n));
  const qs = p.toString().replace(/%2C/g, ",");
  return qs ? `${config.basePath}?${qs}` : config.basePath;
}

export function appliedCount(state: ListingState) {
  return state.finishes.length + (state.category ? 1 : 0) + (state.inStock ? 1 : 0);
}

export function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}
