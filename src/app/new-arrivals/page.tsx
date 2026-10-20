import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Suspense } from "react";
import { queryProducts } from "@/lib/catalog";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { HeaderPhotos, PageHeader } from "@/components/catalog/CatalogHeader";
import { photosFor } from "@/components/product/ProductMedia";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest Diamentory pieces — new rings, chains & lockets, and bracelets.",
  alternates: { canonical: "/new-arrivals" },
  openGraph: { images: SITE.ogImages, title: "New Arrivals — DIAMENTORY", url: "/new-arrivals" },
};

const CONFIG: ListingConfig = { basePath: "/new-arrivals", newOnly: true, allowCategory: true, defaultSort: "newest" };

export default function NewArrivalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const latest = queryProducts({ newOnly: true, sort: "newest" });
  const photos = latest.slice(0, 3).map((p) => ({ ...photosFor(p)[0], href: `/product/${p.slug}` }));
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: "New arrivals" }]}
        eyebrow="Just in"
        title="New"
        accent="arrivals"
        intro="The most recent additions to the line, newest first."
        meta={`${latest.length} new ${latest.length === 1 ? "piece" : "pieces"}`}
        media={<HeaderPhotos photos={photos} priority />}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
