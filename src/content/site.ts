/**
 * Site-wide brand and business content.
 * Anything marked `pending: true` is awaiting confirmation from Diamentory and
 * is rendered with a visible "to be confirmed" treatment — never as fact.
 */
export const SITE = {
  name: "DIAMENTORY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Statement chains, bracelets, rings and pendants in gold, silver, black and two-tone. Jewellery for those who define their own style.",
  instagram: "https://www.instagram.com/_diamentory/",
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

export const NAV_PRIMARY = [
  { href: "/shop/chains", label: "Chains" },
  { href: "/shop/bracelets", label: "Bracelets" },
  { href: "/shop/rings", label: "Rings" },
  { href: "/shop/pendants", label: "Pendants" },
  { href: "/shop/sets", label: "Sets & Stacks" },
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
