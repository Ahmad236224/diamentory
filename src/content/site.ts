/**
 * Site-wide brand and business content.
 * Anything marked `pending: true` is awaiting confirmation from Diamentory and
 * is rendered with a visible "to be confirmed" treatment — never as fact.
 */
export const SITE = {
  name: "DIAMENTORY",
  // Canonical origin for canonicals, sitemap, robots and OG. Set NEXT_PUBLIC_SITE_URL when a custom domain goes live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://diamentory.vercel.app",
  description:
    "Statement rings, chains & lockets and bracelets in gold, silver and two-tone. Jewellery for those who define their own style, shipped all over Pakistan.",
  instagram: "https://www.instagram.com/_diamentory/",
  /** Default share image (genuine studio frame) — spread into every page-level openGraph. */
  ogImages: [{ url: "/images/products/chain-cuban-silver.jpg", width: 768, height: 1376, alt: "Silver Cuban link chain by Diamentory" }],
  instagramHandle: "@_diamentory",
  currency: "PKR",
  country: "Pakistan",
};

export type Pending<T> = { value: T | null; pending: boolean };

/** Business inputs awaiting confirmation. Replace values and set pending:false. */
export const BUSINESS = {
  email: { value: null, pending: true } as Pending<string>,
  phone: { value: null, pending: true } as Pending<string>,
  whatsapp: { value: null, pending: true } as Pending<string>,
  hours: { value: null, pending: true } as Pending<string>,
  /** Standard delivery fee in PKR. */
  deliveryFee: { value: null, pending: true } as Pending<number>,
  freeDeliveryThreshold: { value: null, pending: true } as Pending<number>,
  deliveryTime: { value: null, pending: true } as Pending<string>,
  returnWindowDays: { value: null, pending: true } as Pending<number>,
  bankDetails: { value: null, pending: true } as Pending<string>,
};

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
];

/** The three top-level categories — same order everywhere. */
export const NAV_PRIMARY = [
  { href: "/shop/rings", label: "Rings" },
  { href: "/shop/chains", label: "Chain & Lockets" },
  { href: "/shop/bracelets", label: "Bracelets" },
];

export const NAV_SECONDARY = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/our-story", label: "Our Story" },
];

export const NAV_SUPPORT = [
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns & Exchanges" },
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Track Order" },
];

export const NAV_LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];
