"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Finish, Product } from "@/lib/catalog/types";
import { Gallery } from "./Gallery";
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
  return (
    <div className="mx-auto max-w-[1800px] lg:gutter lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-20">
      <Suspense fallback={null}>
        <FinishFromUrl selection={selection} />
      </Suspense>
      <div className="lg:col-span-7">
        <Gallery product={product} finish={selection.finish} />
      </div>
      <div className="lg:col-span-5">
        <div className="gutter pt-7 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:px-0 lg:pt-4">
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
