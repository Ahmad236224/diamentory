import type { Metadata } from "next";
import { Suspense } from "react";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { PageHeader } from "@/components/catalog/CatalogHeader";
import { SearchField, SearchForm } from "@/components/catalog/SearchField";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Diamentory collection by piece, style or finish.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

const CONFIG: ListingConfig = { basePath: "/search", search: true, allowCategory: true };

export default function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Search" }]} eyebrow="Search" title="Find" accent="your piece">
        <div className="mt-8 max-w-3xl">
          <Suspense fallback={<SearchForm />}>
            <SearchField />
          </Suspense>
        </div>
      </PageHeader>
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
