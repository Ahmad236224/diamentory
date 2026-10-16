export type CategorySlug = "chains" | "bracelets" | "rings" | "pendants" | "sets";

export type Finish = "gold" | "silver" | "black" | "two-tone";

/** Visual form used by the placeholder art renderer until real photography exists. */
export type ArtForm =
  | "cuban-chain"
  | "rope-chain"
  | "tennis-chain"
  | "box-chain"
  | "cuban-bracelet"
  | "tennis-bracelet"
  | "cuff"
  | "bangle"
  | "band-ring"
  | "signet-ring"
  | "stone-ring"
  | "pendant-cross"
  | "pendant-disc"
  | "pendant-bar"
  | "set";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Variant {
  id: string;
  finish: Finish;
  /** Size or length label, e.g. "20 in" or "US 9". Null when the product is one-size. */
  size: string | null;
  /** Whole Pakistani rupees. */
  price: number;
  stock: number;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  description: string;
  /** Only filled when verified by the brand. */
  materials?: string;
  dimensions?: string;
  care?: string;
  art: ArtForm;
  images: ProductImage[];
  variants: Variant[];
  sizeLabel?: "Length" | "Size" | "Wrist";
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string; // ISO date
  /** True for development sample data. Must be false for real catalogue entries. */
  isFixture: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  intro: string;
  art: ArtForm;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";
