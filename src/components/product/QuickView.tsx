"use client";

import Link from "next/link";
import { useState } from "react";
import type { Finish, Product } from "@/lib/catalog/types";
import { Dialog } from "@/components/ui/Dialog";
import { IconPlus } from "@/components/ui/icons";
import { ProductMedia } from "./ProductMedia";
import { PurchasePanel } from "./PurchasePanel";
import { useVariantSelection } from "./useVariantSelection";

function QuickViewBody({ product, finish, onClose }: { product: Product; finish: Finish; onClose: () => void }) {
  const selection = useVariantSelection(product, finish);
  return (
    <div className="grid flex-1 overflow-y-auto overscroll-contain md:grid-cols-2">
      <ProductMedia
        product={product}
        finish={selection.finish}
        className="hidden aspect-[4/5] md:block"
        sizes="(min-width:768px) 40vw, 1px"
      />
      <div className="gutter py-6 md:p-8">
        <p className="eyebrow text-stone">{product.subcategory}</p>
        <h3 className="mt-2 font-serif text-3xl leading-none">{product.name}</h3>
        <div className="mt-5">
          <PurchasePanel product={product} selection={selection} showBuyNow={false} onAdded={onClose} />
        </div>
        <Link href={`/product/${product.slug}`} onClick={onClose} className="eyebrow link-line mt-2 inline-flex min-h-11 items-center">
          View full details
        </Link>
      </div>
    </div>
  );
}

/** Quick view / quick add: bottom sheet on mobile, centred panel on desktop. */
export function QuickView({ product, finish }: { product: Product; finish: Finish }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center bg-ivory/90 text-obsidian backdrop-blur transition-[opacity,transform] duration-500 hover:bg-obsidian hover:text-ivory [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        aria-label={`Quick add ${product.name}`}
      >
        <IconPlus size={18} />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} side="bottom" label={`Quick view: ${product.name}`} title="Quick add" className="md:!max-w-4xl">
        <QuickViewBody product={product} finish={finish} onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
