/**
 * ⚠ DEVELOPMENT FIXTURES — NOT THE REAL DIAMENTORY CATALOGUE.
 *
 * Product names, prices, sizes and stock levels below are sample data used to
 * build and test the storefront. They must be replaced by the brand's verified
 * catalogue (via the admin, once the backend phase lands) before launch.
 *
 * Deliberately omitted: materials, metal purity, plating, stone details,
 * dimensions and care text — none of these have been verified.
 */
import type { ArtForm, CategorySlug, Finish, Product, Variant } from "./types";

type Def = {
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  art: ArtForm;
  finishes: Finish[];
  sizes: string[] | null;
  sizeLabel?: Product["sizeLabel"];
  price: number;
  /** Optional per-finish price override. */
  finishPrice?: Partial<Record<Finish, number>>;
  /** Variant ids ("finish|size") that are sold out. */
  soldOut?: string[];
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
};

const DEFS: Def[] = [
  // ── Chains & necklaces ──
  {
    slug: "cuban-link-chain",
    name: "Cuban Link Chain",
    category: "chains",
    subcategory: "Cuban link",
    art: "cuban-chain",
    finishes: ["gold", "silver", "black"],
    sizes: ["18 in", "20 in", "22 in", "24 in"],
    sizeLabel: "Length",
    price: 6800,
    finishPrice: { black: 7200 },
    soldOut: ["black|24 in"],
    description:
      "A heavy, close-set Cuban link with a flat profile that sits cleanly against the collarbone. Worn alone or as the anchor of a stack.",
    isFeatured: true,
    createdAt: "2026-08-02",
  },
  {
    slug: "rope-chain",
    name: "Rope Chain",
    category: "chains",
    subcategory: "Rope",
    art: "rope-chain",
    finishes: ["gold", "silver"],
    sizes: ["20 in", "22 in", "24 in"],
    sizeLabel: "Length",
    price: 4900,
    description:
      "Twisted links that catch light from every angle. A classic rope profile with a slim, everyday weight.",
    createdAt: "2026-06-11",
  },
  {
    slug: "tennis-chain",
    name: "Tennis Chain",
    category: "chains",
    subcategory: "Tennis",
    art: "tennis-chain",
    finishes: ["silver", "gold", "black"],
    sizes: ["18 in", "20 in", "22 in"],
    sizeLabel: "Length",
    price: 8900,
    description:
      "A continuous line of set stones in individual settings. Fluid, flexible and built to be seen.",
    isFeatured: true,
    isNew: true,
    createdAt: "2026-09-21",
  },
  {
    slug: "box-chain",
    name: "Box Chain",
    category: "chains",
    subcategory: "Box",
    art: "box-chain",
    finishes: ["silver", "black", "gold"],
    sizes: ["20 in", "22 in"],
    sizeLabel: "Length",
    price: 3600,
    description:
      "Square, architectural links in a fine gauge. The quiet base layer for pendants and stacks.",
    createdAt: "2026-05-04",
  },
  {
    slug: "two-tone-cuban-chain",
    name: "Two-Tone Cuban Chain",
    category: "chains",
    subcategory: "Cuban link",
    art: "cuban-chain",
    finishes: ["two-tone"],
    sizes: ["20 in", "22 in"],
    sizeLabel: "Length",
    price: 7600,
    description:
      "Alternating tones across a bold Cuban link. Designed for contrast against both light and dark tailoring.",
    isNew: true,
    createdAt: "2026-10-01",
  },

  // ── Bracelets ──
  {
    slug: "cuban-link-bracelet",
    name: "Cuban Link Bracelet",
    category: "bracelets",
    subcategory: "Cuban link",
    art: "cuban-bracelet",
    finishes: ["gold", "silver", "black"],
    sizes: ["7 in", "8 in", "9 in"],
    sizeLabel: "Wrist",
    price: 4200,
    description:
      "The Cuban link scaled for the wrist. Substantial, flat and finished with a secure box clasp.",
    isFeatured: true,
    createdAt: "2026-07-14",
  },
  {
    slug: "tennis-bracelet",
    name: "Tennis Bracelet",
    category: "bracelets",
    subcategory: "Tennis",
    art: "tennis-bracelet",
    finishes: ["silver", "gold"],
    sizes: ["7 in", "8 in"],
    sizeLabel: "Wrist",
    price: 5400,
    soldOut: ["gold|8 in"],
    description:
      "A single line of set stones that moves with the wrist. Pairs with a watch or a cuff.",
    isNew: true,
    createdAt: "2026-09-30",
  },
  {
    slug: "sculpted-cuff",
    name: "Sculpted Cuff",
    category: "bracelets",
    subcategory: "Cuff",
    art: "cuff",
    finishes: ["silver", "gold", "black"],
    sizes: null,
    price: 3900,
    description:
      "An open cuff with a softly bevelled edge. Sculptural on its own, grounding in a stack.",
    isFeatured: true,
    createdAt: "2026-06-28",
  },
  {
    slug: "plain-bangle",
    name: "Plain Bangle",
    category: "bracelets",
    subcategory: "Bangle",
    art: "bangle",
    finishes: ["gold", "silver"],
    sizes: ["S/M", "M/L"],
    sizeLabel: "Size",
    price: 3200,
    description: "A clean, closed bangle with a rounded profile. Minimal by design.",
    createdAt: "2026-04-19",
  },
  {
    slug: "black-tennis-bracelet",
    name: "Black Tennis Bracelet",
    category: "bracelets",
    subcategory: "Tennis",
    art: "tennis-bracelet",
    finishes: ["black"],
    sizes: ["7 in", "8 in"],
    sizeLabel: "Wrist",
    price: 5800,
    soldOut: ["black|7 in", "black|8 in"],
    description: "Tonal black stones in black settings. Low-key until it catches the light.",
    createdAt: "2026-03-08",
  },

  // ── Rings ──
  {
    slug: "classic-band",
    name: "Classic Band",
    category: "rings",
    subcategory: "Band",
    art: "band-ring",
    finishes: ["gold", "silver", "black"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    sizeLabel: "Size",
    price: 2400,
    description: "A comfort-fit band with a flat face. The ring you forget you're wearing.",
    createdAt: "2026-05-22",
  },
  {
    slug: "signet-ring",
    name: "Signet Ring",
    category: "rings",
    subcategory: "Signet",
    art: "signet-ring",
    finishes: ["gold", "silver"],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    sizeLabel: "Size",
    price: 3800,
    description:
      "A smooth oval signet with a tapered shoulder. A statement in its simplest form.",
    isFeatured: true,
    createdAt: "2026-07-03",
  },
  {
    slug: "statement-stone-ring",
    name: "Statement Stone Ring",
    category: "rings",
    subcategory: "Statement",
    art: "stone-ring",
    finishes: ["silver", "gold", "two-tone"],
    sizes: ["US 8", "US 9", "US 10"],
    sizeLabel: "Size",
    price: 4600,
    description: "A raised square-set stone on a heavy shank. Built to anchor the hand.",
    isNew: true,
    createdAt: "2026-10-06",
  },
  {
    slug: "black-band",
    name: "Black Band",
    category: "rings",
    subcategory: "Band",
    art: "band-ring",
    finishes: ["black"],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    sizeLabel: "Size",
    price: 2600,
    description: "A matte black band with sharp edges. Industrial, minimal, considered.",
    createdAt: "2026-02-14",
  },

  // ── Pendants ──
  {
    slug: "cross-pendant",
    name: "Cross Pendant",
    category: "pendants",
    subcategory: "Pendant necklace",
    art: "pendant-cross",
    finishes: ["gold", "silver", "black"],
    sizes: ["20 in", "22 in"],
    sizeLabel: "Length",
    price: 4400,
    description: "A clean-lined cross on a fine box chain. Proportioned to sit at the sternum.",
    isFeatured: true,
    createdAt: "2026-08-18",
  },
  {
    slug: "disc-pendant",
    name: "Disc Pendant",
    category: "pendants",
    subcategory: "Pendant necklace",
    art: "pendant-disc",
    finishes: ["gold", "silver"],
    sizes: ["20 in", "22 in"],
    sizeLabel: "Length",
    price: 3900,
    description: "A brushed disc with a polished rim. Quiet texture against skin or cloth.",
    isNew: true,
    createdAt: "2026-09-12",
  },
  {
    slug: "bar-pendant",
    name: "Bar Pendant",
    category: "pendants",
    subcategory: "Pendant",
    art: "pendant-bar",
    finishes: ["silver", "black", "gold"],
    sizes: null,
    price: 2900,
    description: "A slim vertical bar pendant. Sold without chain to pair with your own.",
    createdAt: "2026-04-02",
  },

  // ── Sets & stacks ──
  {
    slug: "chain-and-bracelet-set",
    name: "Chain & Bracelet Set",
    category: "sets",
    subcategory: "Set",
    art: "set",
    finishes: ["gold", "silver"],
    sizes: null,
    price: 9800,
    description:
      "A matched Cuban link chain and bracelet, selected to be worn together.",
    isFeatured: true,
    createdAt: "2026-08-25",
  },
  {
    slug: "two-tone-stack",
    name: "Two-Tone Stack",
    category: "sets",
    subcategory: "Stack",
    art: "set",
    finishes: ["two-tone"],
    sizes: null,
    price: 11200,
    description: "A curated stack in mixed tones: chain, bracelet and band.",
    isNew: true,
    createdAt: "2026-10-09",
  },
];

function buildVariants(d: Def): Variant[] {
  const sizes = d.sizes ?? [null];
  return d.finishes.flatMap((finish) =>
    sizes.map((size) => {
      const key = `${finish}|${size ?? ""}`.replace(/\|$/, "");
      const soldOut = d.soldOut?.some((s) => s === `${finish}|${size}` || s === finish);
      return {
        id: `${d.slug}--${key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        finish,
        size,
        price: d.finishPrice?.[finish] ?? d.price,
        stock: soldOut ? 0 : 3 + ((d.slug.length + (size?.length ?? 0)) % 9),
      };
    }),
  );
}

export const FIXTURE_PRODUCTS: Product[] = DEFS.map((d) => ({
  slug: d.slug,
  name: d.name,
  category: d.category,
  subcategory: d.subcategory,
  description: d.description,
  art: d.art,
  images: [],
  variants: buildVariants(d),
  sizeLabel: d.sizeLabel,
  isNew: !!d.isNew,
  isFeatured: !!d.isFeatured,
  createdAt: d.createdAt,
  isFixture: true,
}));
