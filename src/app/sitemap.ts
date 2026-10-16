import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { CATEGORIES, getAllProducts } from "@/lib/catalog";
import { activeFinishes } from "@/components/catalog/finishArt";

const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/shop", priority: 0.9, freq: "weekly" },
  { path: "/new-arrivals", priority: 0.8, freq: "weekly" },
  { path: "/collections", priority: 0.7, freq: "monthly" },
  { path: "/lookbook", priority: 0.6, freq: "monthly" },
  { path: "/our-story", priority: 0.5, freq: "yearly" },
  { path: "/contact", priority: 0.4, freq: "yearly" },
  { path: "/shipping", priority: 0.3, freq: "monthly" },
  { path: "/returns", priority: 0.3, freq: "monthly" },
  { path: "/faq", priority: 0.4, freq: "monthly" },
  { path: "/track-order", priority: 0.2, freq: "yearly" },
  { path: "/privacy", priority: 0.1, freq: "yearly" },
  { path: "/terms", priority: 0.1, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const url = (p: string) => `${base}${p === "/" ? "" : p}` || base;

  return [
    ...STATIC_ROUTES.map((r) => ({ url: url(r.path), changeFrequency: r.freq, priority: r.priority })),
    ...CATEGORIES.map((c) => ({ url: url(`/shop/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...activeFinishes().map((f) => ({ url: url(`/collections/${f.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getAllProducts().map((p) => ({
      url: url(`/product/${p.slug}`),
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
