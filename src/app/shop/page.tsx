import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/catalog";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { HeaderPhotos, PageHeader, resolvePhotos } from "@/components/catalog/CatalogHeader";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "Shop All Jewellery",
  description: "Every Diamentory piece in one place — rings, chains & lockets, and bracelets.",
  alternates: { canonical: "/shop" },
  openGraph: { images: SITE.ogImages, title: "Shop All — DIAMENTORY", url: "/shop" },
};

const CONFIG: ListingConfig = { basePath: "/shop", allowCategory: true };

/** One real photograph per category, in category order. */
const PHOTOS = resolvePhotos([
  ["textured-band-ring", 0],
  ["onyx-square-locket", 0, "50% 55%"],
  ["iced-cuban-bracelet", 1],
]);

export default function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const total = getAllProducts().length;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
        eyebrow="The collection"
        title="Shop"
        accent="all"
        intro="Rings, chains & lockets, and bracelets. Filter by category, style or finish — or browse the full line."
        meta={`${total} pieces`}
        media={<HeaderPhotos photos={PHOTOS} priority />}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
