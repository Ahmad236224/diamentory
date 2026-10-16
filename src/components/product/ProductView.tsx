"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Finish, Product } from "@/lib/catalog/types";
import { Gallery } from "./Gallery";
import { photosFor } from "./ProductMedia";
import { PurchasePanel } from "./PurchasePanel";
import { StickyBuyBar } from "./StickyBuyBar";
import { useVariantSelection } from "./useVariantSelection";

type Selection = ReturnType<typeof useVariantSelection>;

/** Applies `?finish=` after hydration so the rest of the page can stay in the static shell. */
function FinishFromUrl({ selection }: { selection: Selection }) {
  const f = useSearchParams().get("finish") as Finish | null;
  const { finishes, setFinish } = selection;
  useEffect(() => {
    if (f && finishes.includes(f)) setFinish(f);
  }, [f]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** Gallery + sticky info column + mobile buy bar, sharing one variant selection. */
export function ProductView({
  product,
  header,
  details,
}: {
  product: Product;
  header: React.ReactNode;
  details: React.ReactNode;
}) {
  const selection = useVariantSelection(product);
  const cta = useRef<HTMLDivElement>(null);
  const single = photosFor(product, selection.finish).length <= 1;
  return (
    // phone: gallery full-bleed; tablet+: on the same .wrap edge as breadcrumbs and grids
    <div className="mx-auto w-full max-w-[calc(var(--container)+2*var(--gutter))] md:px-[var(--gutter)] lg:grid lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
      <Suspense fallback={null}>
        <FinishFromUrl selection={selection} />
      </Suspense>
      <div className={single ? "lg:col-span-6" : "lg:col-span-6 xl:col-span-7"}>
        <Gallery key={selection.finish} product={product} finish={selection.finish} />
      </div>
      <div className={single ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9"}>
        <div className="px-[var(--gutter)] pt-7 md:px-0 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:pt-0">
          {header}
          <div className="mt-6">
            <PurchasePanel product={product} selection={selection} ctaRef={cta} />
          </div>
          {details}
        </div>
      </div>
      <StickyBuyBar product={product} selection={selection} target={cta} />
    </div>
  );
}
