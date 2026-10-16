import type { Metadata } from "next";
import { Suspense } from "react";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { SearchField, SearchForm } from "@/components/catalog/SearchField";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Diamentory collection by piece, form or finish.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

const CONFIG: ListingConfig = { basePath: "/search", search: true, allowCategory: true };

export default function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <header className="gutter mx-auto max-w-[1800px] pt-10 pb-10 lg:pt-16 lg:pb-14">
        <p className="eyebrow text-stone">Search</p>
        <h1 className="display mt-4 text-[3.25rem] sm:text-7xl">
          Find <em className="italic">your piece</em>
        </h1>
        <div className="mt-8 max-w-3xl">
          <Suspense fallback={<SearchForm />}>
            <SearchField />
          </Suspense>
        </div>
      </header>
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
