import type { Category, CategorySlug, Finish, Product, SortKey } from "./types";
import { FIXTURE_PRODUCTS } from "./fixtures";

export * from "./types";

/** Swap this source for the database-backed catalogue in the backend phase. */
const PRODUCTS: Product[] = FIXTURE_PRODUCTS;

export const USING_FIXTURES = PRODUCTS.some((p) => p.isFixture);

export const CATEGORIES: Category[] = [
  {
    slug: "chains",
    name: "Chains & Necklaces",
    shortName: "Chains",
    tagline: "The line that defines the look.",
    intro: "Cuban, rope, tennis and box chains in gold, silver, black and two-tone finishes.",
    art: "cuban-chain",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    shortName: "Bracelets",
    tagline: "Weight at the wrist.",
    intro: "Cuban link and tennis bracelets, cuffs and bangles, made to be worn together.",
    art: "cuban-bracelet",
  },
  {
    slug: "rings",
    name: "Rings",
    shortName: "Rings",
    tagline: "Small form. Full statement.",
    intro: "Bands, signets and statement rings for every finger and every stack.",
    art: "signet-ring",
  },
  {
    slug: "pendants",
    name: "Pendants",
    shortName: "Pendants",
    tagline: "A point of focus.",
    intro: "Pendants and pendant necklaces, from clean geometry to symbolic forms.",
    art: "pendant-cross",
  },
  {
    slug: "sets",
    name: "Sets & Stacks",
    shortName: "Sets",
    tagline: "Composed to be worn together.",
    intro: "Matched sets and curated stacks, styled so you don't have to.",
    art: "set",
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
