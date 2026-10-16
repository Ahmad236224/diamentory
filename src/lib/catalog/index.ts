import type { Category, CategorySlug, Finish, Product, SortKey } from "./types";
import { FIXTURE_PRODUCTS } from "./fixtures";

export * from "./types";

/** Swap this source for the database-backed catalogue in the backend phase. */
const PRODUCTS: Product[] = FIXTURE_PRODUCTS;

export const USING_FIXTURES = PRODUCTS.some((p) => p.isFixture);

/** Exactly three top-level categories, in this order everywhere. */
export const CATEGORIES: Category[] = [
  {
    slug: "rings",
    name: "Rings",
    shortName: "Rings",
    tagline: "Small form. Full statement.",
    intro: "Bands and statement rings with textured, polished and stone-set finishes.",
    art: "band-ring",
  },
  {
    slug: "chains",
    name: "Chain & Lockets",
    shortName: "Chain & Lockets",
    tagline: "The line that defines the look.",
    intro: "Cuban, rope, herringbone, Franco, snake and box chains — and the lockets and pendants that hang from them.",
    art: "cuban-chain",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    shortName: "Bracelets",
    tagline: "Weight at the wrist.",
    intro: "Cuban link and iced bracelets, built to be worn on their own or stacked.",
    art: "cuban-bracelet",
  },
];

export const FINISHES: { slug: Finish; name: string; note: string }[] = [
  { slug: "gold", name: "Gold", note: "Warm, luminous, unmistakable." },
  { slug: "silver", name: "Silver", note: "Cool clarity with a sharp edge." },
  { slug: "black", name: "Black", note: "Industrial, tonal, understated." },
  { slug: "two-tone", name: "Two-Tone", note: "Contrast as a design principle." },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getFinish(slug: string) {
  return FINISHES.find((f) => f.slug === slug);
}

export function getAllProducts() {
  return PRODUCTS;
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function priceRange(p: Product) {
  const prices = p.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function productFinishes(p: Product): Finish[] {
  return [...new Set(p.variants.map((v) => v.finish))];
}

export function isSoldOut(p: Product) {
  return p.variants.every((v) => v.stock <= 0);
}

export function totalStock(p: Product) {
  return p.variants.reduce((n, v) => n + Math.max(0, v.stock), 0);
}

export interface Query {
  category?: CategorySlug;
  /** Subcategory / style within a category, e.g. "Cuban link", "Locket" (case-insensitive). */
  style?: string;
  finish?: Finish[];
  q?: string;
  sort?: SortKey;
  newOnly?: boolean;
  inStock?: boolean;
}

function normalise(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ").trim();
}

export function searchScore(p: Product, q: string) {
  const terms = normalise(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return 1;
  const hay = normalise(
    [p.name, p.subcategory, getCategory(p.category)?.name, productFinishes(p).join(" "), p.description].join(" "),
  );
  const name = normalise(p.name);
  let score = 0;
  for (const t of terms) {
    const stem = t.replace(/s$/, "");
    if (name.includes(stem)) score += 3;
    else if (hay.includes(stem)) score += 1;
    else return 0; // every term must match
  }
  return score;
}

export function queryProducts(query: Query): Product[] {
  let list = PRODUCTS.slice();
  if (query.category) list = list.filter((p) => p.category === query.category);
  if (query.style) {
    const st = query.style.toLowerCase();
    list = list.filter((p) => p.subcategory.toLowerCase() === st);
  }
  if (query.finish?.length) {
    const set = new Set(query.finish);
    list = list.filter((p) => p.variants.some((v) => set.has(v.finish)));
  }
  if (query.newOnly) list = list.filter((p) => p.isNew);
  if (query.inStock) list = list.filter((p) => !isSoldOut(p));

  const scores = new Map<string, number>();
  if (query.q?.trim()) {
    for (const p of list) scores.set(p.slug, searchScore(p, query.q));
    list = list.filter((p) => (scores.get(p.slug) ?? 0) > 0);
  }

  const sort = query.sort ?? (query.q ? undefined : "featured");
  list.sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      case "price-asc":
        return priceRange(a).min - priceRange(b).min;
      case "price-desc":
        return priceRange(b).min - priceRange(a).min;
      case "featured":
        return (
          Number(isSoldOut(a)) - Number(isSoldOut(b)) ||
          Number(b.isFeatured) - Number(a.isFeatured) ||
          b.createdAt.localeCompare(a.createdAt)
        );
      default:
        return (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0);
    }
  });
  return list;
}

/** Complementary products: same finish family, different category first. */
export function getComplementary(p: Product, limit = 4) {
  const finishes = new Set(productFinishes(p));
  return PRODUCTS.filter((o) => o.slug !== p.slug && !isSoldOut(o))
    .map((o) => ({
      o,
      s:
        (o.category !== p.category ? 2 : 0) +
        (o.variants.some((v) => finishes.has(v.finish)) ? 1 : 0) +
        (o.isFeatured ? 0.5 : 0),
    }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.o);
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function parseFinishParam(v: string | string[] | undefined): Finish[] {
  const raw = (Array.isArray(v) ? v.join(",") : v ?? "").split(",");
  return raw.filter((x): x is Finish => FINISHES.some((f) => f.slug === x));
}

export function parseSortParam(v: string | string[] | undefined): SortKey | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return SORT_OPTIONS.some((o) => o.value === s) ? (s as SortKey) : undefined;
}

/** Distinct styles (subcategories) present in a product list, in first-seen order. */
export function stylesOf(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.subcategory).filter(Boolean))];
}

/** URL-safe style slug: "Cuban link" → "cuban-link". */
export const styleSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parseStyleParam(v: string | string[] | undefined, products: Product[]): string | undefined {
  const raw = (Array.isArray(v) ? v[0] : v)?.toLowerCase();
  if (!raw) return undefined;
  return stylesOf(products).find((s) => styleSlug(s) === raw);
}
