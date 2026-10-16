import type { Metadata } from "next";
import { Suspense } from "react";
import { queryProducts } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { CategoryNav, PageHeader } from "@/components/catalog/CatalogHeader";
import type { ListingConfig, SearchParams } from "@/components/catalog/listingState";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest Diamentory pieces — new chains, bracelets, rings, pendants and stacks.",
  alternates: { canonical: "/new-arrivals" },
  openGraph: { title: "New Arrivals — DIAMENTORY", url: "/new-arrivals" },
};

const CONFIG: ListingConfig = { basePath: "/new-arrivals", newOnly: true, allowCategory: true, defaultSort: "newest" };

export default function NewArrivalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const total = queryProducts({ newOnly: true }).length;
  return (
    <>
      <PageHeader
        eyebrow="Just in"
        title="New"
        accent="arrivals"
        art={
          <div className="mb-6 grid grid-cols-3 gap-2" aria-hidden="true">
            <div className="clip-in aspect-[3/4] overflow-hidden">
              <JewelArt form="tennis-chain" finish="silver" tone="dark" crop={[200, 420, 600, 800]} />
            </div>
            <div className="clip-in aspect-[3/4] overflow-hidden [animation-delay:.12s]">
              <JewelArt form="stone-ring" finish="two-tone" tone="stone" crop={[160, 200, 680, 900]} />
            </div>
            <div className="clip-in aspect-[3/4] overflow-hidden [animation-delay:.24s]">
              <JewelArt form="pendant-disc" finish="gold" tone="dark" crop={[200, 560, 600, 800]} />
            </div>
          </div>
        }
        intro="The most recent additions to the line, newest first."
        meta={`${total} new ${total === 1 ? "piece" : "pieces"}`}
      />
      <CategoryNav active="new" />
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={CONFIG} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
