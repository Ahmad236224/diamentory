import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/catalog";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { CategoryNav, PageHeader } from "@/components/catalog/CatalogHeader";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "Shop All Jewellery",
  description:
    "Every Diamentory piece in one place — chains, bracelets, rings, pendants and sets in gold, silver, black and two-tone finishes.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop All — DIAMENTORY", url: "/shop" },
};

const CONFIG: ListingConfig = { basePath: "/shop", allowCategory: true };

export default function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const total = getAllProducts().length;
  return (
    <>
      <PageHeader
        eyebrow="The collection"
        title="Shop"
        accent="all"
        intro="Chains, bracelets, rings, pendants and sets — each made in a choice of finishes. Filter by the tone you wear, or browse the full line."
        meta={`${total} pieces`}
      />
      <CategoryNav active="all" />
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
