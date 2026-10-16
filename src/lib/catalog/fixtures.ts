/**
 * ⚠ DEVELOPMENT CATALOGUE — REAL PHOTOGRAPHS, SAMPLE COMMERCIAL DATA.
 *
 * Every product below corresponds to a genuine Diamentory piece shown in the client's
 * studio photography (public/images/products/) or the brand's own Instagram
 * (public/images/brand/). Product names describe what is visible in the photo.
 *
 * Prices, sizes/lengths and stock levels are SAMPLE values for building and testing the
 * store, and are labelled as such on the site. Replace them with verified data before launch.
 *
 * Deliberately omitted: materials, metal purity, plating, stone details, dimensions, care.
 */
import type { ArtForm, CategorySlug, Finish, Product, ProductImage, Variant } from "./types";

type Img = { src: string; alt: string; finish?: Finish; focus?: string; w?: number; h?: number };

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
  finishPrice?: Partial<Record<Finish, number>>;
  /** "finish|size" or "finish" combinations that are sold out. */
  soldOut?: string[];
  description: string;
  images: Img[];
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
};

// Studio shots are 768×1376 portrait; Instagram frames vary.
const STUDIO = { w: 768, h: 1376 };
const P = "/images/products/";
const B = "/images/brand/";

const CHAIN_LENGTHS = ["20 in", "22 in", "24 in"];
const RING_SIZES = ["US 8", "US 9", "US 10", "US 11"];
const WRIST = ["7 in", "8 in"];

const DEFS: Def[] = [
  /* ── Chain & Lockets ── */
  {
    slug: "cuban-link-chain",
    name: "Cuban Link Chain",
    category: "chains",
    subcategory: "Cuban link",
    art: "cuban-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 6800,
    soldOut: ["silver|24 in"],
    description: "A heavy, close-set Cuban link that sits flat against the collarbone. Worn alone, it is the whole statement.",
    images: [{ src: `${P}chain-cuban-silver.jpg`, alt: "Silver Cuban link chain worn with an open white shirt", focus: "50% 30%" }],
    isFeatured: true,
    createdAt: "2026-10-10",
  },
  {
    slug: "flat-curb-chain",
    name: "Flat Curb Chain",
    category: "chains",
    subcategory: "Cuban link",
    art: "cuban-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 5600,
    description: "A flattened curb link with a crisp, engraved edge. Lower profile than the Cuban, just as present.",
    images: [{ src: `${P}chain-flat-curb-silver.jpg`, alt: "Silver flat curb chain worn with an open white shirt", focus: "50% 28%" }],
    isNew: true,
    createdAt: "2026-10-12",
  },
  {
    slug: "rope-chain",
    name: "Rope Chain",
    category: "chains",
    subcategory: "Rope",
    art: "rope-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 4900,
    description: "Twisted links that catch light from every angle — a classic rope with real weight.",
    images: [{ src: `${P}chain-rope-silver.jpg`, alt: "Silver rope chain worn with an open white shirt", focus: "50% 30%" }],
    isFeatured: true,
    createdAt: "2026-09-20",
  },
  {
    slug: "herringbone-chain",
    name: "Herringbone Chain",
    category: "chains",
    subcategory: "Herringbone",
    art: "box-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 4400,
    description: "A fluid, flat herringbone that lies like liquid metal on the skin.",
    images: [{ src: `${P}chain-herringbone-silver.jpg`, alt: "Silver herringbone chain worn with an open white shirt", focus: "50% 30%" }],
    createdAt: "2026-09-02",
  },
  {
    slug: "franco-chain",
    name: "Franco Chain",
    category: "chains",
    subcategory: "Franco",
    art: "box-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 3900,
    description: "Tight, V-shaped links with a square profile. Strong, slim and made for everyday wear.",
    images: [{ src: `${P}chain-franco-silver.jpg`, alt: "Silver Franco chain worn with an open white shirt", focus: "50% 30%" }],
    createdAt: "2026-08-14",
  },
  {
    slug: "round-snake-chain",
    name: "Round Snake Chain",
    category: "chains",
    subcategory: "Snake",
    art: "box-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 3400,
    description: "A smooth, round snake chain — the clean base for a locket, or worn on its own.",
    images: [
      { src: `${P}chain-round-snake-silver-a.jpg`, alt: "Silver round snake chain worn with an open white shirt", focus: "50% 30%" },
      { src: `${P}chain-round-snake-silver-b.jpg`, alt: "Silver round snake chain, close view at the collarbone", focus: "50% 30%" },
    ],
    createdAt: "2026-08-01",
  },
  {
    slug: "box-chain",
    name: "Round Box Chain",
    category: "chains",
    subcategory: "Box",
    art: "box-chain",
    finishes: ["silver"],
    sizes: CHAIN_LENGTHS,
    sizeLabel: "Length",
    price: 3600,
    description: "Rounded box links with a soft, architectural rhythm.",
    images: [{ src: `${P}chain-round-box-silver.jpg`, alt: "Silver round box chain worn with an open white shirt", focus: "50% 30%" }],
    createdAt: "2026-07-22",
  },
  {
    slug: "onyx-square-locket",
    name: "Onyx Square Locket",
    category: "chains",
    subcategory: "Locket",
    art: "pendant-bar",
    finishes: ["gold", "silver"],
    sizes: null,
    price: 5200,
    description: "A black square stone framed in metal, hung low on a fine chain. Quiet, graphic, unmistakable.",
    images: [
      { src: `${P}locket-onyx-gold-snake.jpg`, alt: "Gold onyx square locket on a gold snake chain, worn over a white T-shirt", finish: "gold", focus: "50% 42%" },
      { src: `${P}locket-onyx-gold-herringbone.jpg`, alt: "Gold onyx square locket on a gold herringbone chain", finish: "gold", focus: "50% 42%" },
      { src: `${P}locket-onyx-silver.jpg`, alt: "Silver onyx square locket on a silver chain, worn over a white T-shirt", finish: "silver", focus: "50% 42%" },
    ],
    isFeatured: true,
    isNew: true,
    createdAt: "2026-10-08",
  },
  {
    slug: "zulfiqar-pendant",
    name: "Zulfiqar Pendant",
    category: "chains",
    subcategory: "Locket",
    art: "pendant-bar",
    finishes: ["silver"],
    sizes: null,
    price: 4600,
    description: "The double-edged Zulfiqar blade, detailed and stone-set, on a fine silver chain.",
    images: [{ src: `${P}locket-zulfiqar-silver.jpg`, alt: "Silver Zulfiqar sword pendant on a chain, worn over a white T-shirt", focus: "50% 45%" }],
    isFeatured: true,
    createdAt: "2026-10-02",
  },
  {
    slug: "wing-pendant",
    name: "Wing Pendant",
    category: "chains",
    subcategory: "Locket",
    art: "pendant-bar",
    finishes: ["silver"],
    sizes: null,
    price: 3800,
    description: "A single sculpted wing on a slim snake chain.",
    images: [{ src: `${P}locket-wing-silver.jpg`, alt: "Silver wing pendant on a snake chain, worn over a white T-shirt", focus: "50% 40%" }],
    createdAt: "2026-09-12",
  },
  {
    slug: "ali-name-pendant",
    name: "Ali Name Pendant",
    category: "chains",
    subcategory: "Locket",
    art: "pendant-disc",
    finishes: ["silver"],
    sizes: null,
    price: 4200,
    description: "“Ali” in Arabic calligraphy, polished and hung on a snake chain.",
    images: [{ src: `${B}brand-ali-pendant-snake-chain.jpg`, alt: "Silver pendant spelling Ali in Arabic script on a snake chain, on black fabric", focus: "50% 60%", w: 1440, h: 1920 }],
    createdAt: "2026-07-05",
  },
  {
    slug: "lightning-pendant",
    name: "Iced Lightning Pendant",
    category: "chains",
    subcategory: "Locket",
    art: "pendant-bar",
    finishes: ["silver"],
    sizes: null,
    price: 3900,
    description: "A stone-set lightning bolt on a fine chain.",
    images: [{ src: `${B}brand-lightning-pendant-bust.jpg`, alt: "Iced lightning bolt pendant on a fine chain, displayed on a black bust", focus: "50% 55%", w: 720, h: 1280 }],
    createdAt: "2026-06-18",
  },

  /* ── Rings ── */
  {
    slug: "textured-band-ring",
    name: "Textured Band Ring",
    category: "rings",
    subcategory: "Band",
    art: "band-ring",
    finishes: ["gold"],
    sizes: RING_SIZES,
    sizeLabel: "Size",
    price: 3600,
    description: "Layered bands with a sparkling, sand-textured finish that catches every light.",
    images: [{ src: `${P}ring-textured-band-gold.jpg`, alt: "Gold textured layered band ring worn on the ring finger", focus: "55% 48%" }],
    isFeatured: true,
    isNew: true,
    createdAt: "2026-10-11",
  },
  {
    slug: "textured-wrap-ring",
    name: "Two-Tone Wrap Ring",
    category: "rings",
    subcategory: "Statement",
    art: "band-ring",
    finishes: ["two-tone"],
    sizes: RING_SIZES,
    sizeLabel: "Size",
    price: 3900,
    description: "Crossing bands in two tones, textured and polished in turn.",
    images: [{ src: `${P}ring-textured-wrap-two-tone.jpg`, alt: "Two-tone textured wrap ring worn on the ring finger", focus: "45% 52%" }],
    createdAt: "2026-09-28",
  },
  {
    slug: "stone-band-ring",
    name: "Stone Band Ring",
    category: "rings",
    subcategory: "Band",
    art: "stone-ring",
    finishes: ["two-tone"],
    sizes: RING_SIZES,
    sizeLabel: "Size",
    price: 3400,
    soldOut: ["two-tone|US 11"],
    description: "A warm-toned band with a single set stone and a silver inlay.",
    images: [{ src: `${P}ring-stone-band-two-tone.jpg`, alt: "Two-tone band ring with a single stone worn on the ring finger", focus: "45% 55%" }],
    createdAt: "2026-09-04",
  },
  {
    slug: "brushed-band-ring",
    name: "Brushed Band Ring",
    category: "rings",
    subcategory: "Band",
    art: "band-ring",
    finishes: ["silver"],
    sizes: RING_SIZES,
    sizeLabel: "Size",
    price: 2900,
    description: "A wide band with a matte, sandblasted surface. Industrial and understated.",
    images: [{ src: `${P}ring-brushed-band-silver.jpg`, alt: "Silver brushed band ring worn on the ring finger", focus: "50% 45%" }],
    createdAt: "2026-08-20",
  },
  {
    slug: "sword-wrap-ring",
    name: "Sword Wrap Ring",
    category: "rings",
    subcategory: "Statement",
    art: "signet-ring",
    finishes: ["silver"],
    sizes: RING_SIZES,
    sizeLabel: "Size",
    price: 4200,
    description: "A sculpted blade that wraps the finger, oxidised to bring out every detail.",
    images: [
      { src: `${B}brand-sword-ring-marble.jpg`, alt: "Silver sword wrap ring on marble", focus: "50% 50%", w: 1440, h: 1440 },
      { src: `${B}brand-sword-ring-on-hand.jpg`, alt: "Silver sword wrap ring worn on the finger", focus: "50% 45%", w: 720, h: 1280 },
    ],
    isFeatured: true,
    createdAt: "2026-07-18",
  },

  /* ── Bracelets ── */
  {
    slug: "iced-cuban-bracelet",
    name: "Iced Cuban Bracelet",
    category: "bracelets",
    subcategory: "Cuban link",
    art: "cuban-bracelet",
    finishes: ["silver"],
    sizes: WRIST,
    sizeLabel: "Wrist",
    price: 6400,
    description: "A stone-set Cuban link for the wrist, with a secure box clasp.",
    images: [
      { src: `${B}brand-iced-cuban-bracelet-wrist.jpg`, alt: "Iced Cuban bracelet being fastened on the wrist", focus: "50% 45%", w: 1080, h: 1920 },
      { src: `${B}brand-iced-cuban-bracelet-fist.jpg`, alt: "Iced Cuban bracelet worn on a raised fist", focus: "50% 40%", w: 1080, h: 1920 },
    ],
    isFeatured: true,
    isNew: true,
    createdAt: "2026-10-05",
  },
  {
    slug: "cuban-link-bracelet",
    name: "Cuban Link Bracelet",
    category: "bracelets",
    subcategory: "Cuban link",
    art: "cuban-bracelet",
    finishes: ["silver", "gold"],
    sizes: WRIST,
    sizeLabel: "Wrist",
    price: 4200,
    description: "The classic Cuban link scaled for the wrist — substantial and flat.",
    images: [{ src: `${B}brand-cuban-bracelets-hand.jpg`, alt: "Silver and gold Cuban link bracelets laid across a palm", focus: "50% 50%", w: 720, h: 1280 }],
    createdAt: "2026-09-15",
  },
  {
    slug: "iced-link-bracelet",
    name: "Iced Link Bracelet",
    category: "bracelets",
    subcategory: "Statement",
    art: "tennis-bracelet",
    finishes: ["silver", "gold"],
    sizes: WRIST,
    sizeLabel: "Wrist",
    price: 7200,
    soldOut: ["gold|8 in"],
    description: "Wide, stone-set links in a watch-band profile. Built to be seen.",
    images: [{ src: `${B}brand-iced-link-bracelets-wrist.jpg`, alt: "Gold and silver iced link bracelets worn on the wrist", focus: "50% 50%", w: 720, h: 1280 }],
    createdAt: "2026-08-28",
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

function buildImages(d: Def): ProductImage[] {
  return d.images.map((i) => ({
    src: i.src,
    alt: i.alt,
    width: i.w ?? STUDIO.w,
    height: i.h ?? STUDIO.h,
    finish: i.finish,
    focus: i.focus,
  }));
}

export const FIXTURE_PRODUCTS: Product[] = DEFS.map((d) => ({
  slug: d.slug,
  name: d.name,
  category: d.category,
  subcategory: d.subcategory,
  description: d.description,
  art: d.art,
  images: buildImages(d),
  variants: buildVariants(d),
  sizeLabel: d.sizeLabel,
  isNew: !!d.isNew,
  isFeatured: !!d.isFeatured,
  createdAt: d.createdAt,
  isFixture: true,
}));

/** Old sample slugs → where they now live (used for permanent redirects). */
export const RETIRED_PRODUCT_REDIRECTS: Record<string, string> = {
  "tennis-chain": "/shop/chains",
  "two-tone-cuban-chain": "/product/cuban-link-chain",
  "tennis-bracelet": "/shop/bracelets",
  "black-tennis-bracelet": "/shop/bracelets",
  "sculpted-cuff": "/shop/bracelets",
  "plain-bangle": "/shop/bracelets",
  "classic-band": "/shop/rings",
  "black-band": "/shop/rings",
  "signet-ring": "/shop/rings",
  "statement-stone-ring": "/product/stone-band-ring",
  "cross-pendant": "/shop/chains",
  "disc-pendant": "/shop/chains",
  "bar-pendant": "/shop/chains",
  "chain-and-bracelet-set": "/shop",
  "two-tone-stack": "/shop",
};
