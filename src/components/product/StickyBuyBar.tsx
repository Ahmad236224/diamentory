"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Product } from "@/lib/catalog/types";
import { priceRange } from "@/lib/catalog";
import { formatPrice, formatPriceRange } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { Dialog } from "@/components/ui/Dialog";
import { PurchasePanel } from "./PurchasePanel";
import { FINISH_LABEL, type useVariantSelection } from "./useVariantSelection";

type Selection = ReturnType<typeof useVariantSelection>;

/**
 * Mobile-only purchase bar. Appears once the main "Add to bag" has scrolled out of view,
 * hides near the footer, and opens a variant sheet when a size is still needed.
 */
export function StickyBuyBar({
  product,
  selection,
  target,
}: {
  product: Product;
  selection: Selection;
  target: React.RefObject<HTMLDivElement | null>;
}) {
  const cart = useCart();
  const [past, setPast] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const el = target.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    const footer = document.querySelector("footer");
    const fo = new IntersectionObserver(([e]) => setNearEnd(e.isIntersecting));
    if (footer) fo.observe(footer);
    return () => {
      io.disconnect();
      fo.disconnect();
    };
  }, [target]);

  const { needsSize, size, variant, finish, finishAvailable } = selection;
  const allOut = product.variants.every((v) => v.stock <= 0);
  const soldOut = allOut || !finishAvailable(finish) || (!!variant && variant.stock <= 0);
  const { min, max } = priceRange(product);
  const label = soldOut
    ? "Sold out"
    : needsSize && !size
      ? `Select ${product.sizeLabel?.toLowerCase() ?? "size"}`
      : "Add to bag";

  function act() {
    setNote(null);
    if (soldOut) return;
    if ((needsSize && !size) || !variant) return setSheet(true);
    const res = cart.add(product.slug, variant.id, 1);
    if (!res.ok) return setNote(res.message ?? "Could not add to bag.");
    cart.open();
  }

  const visible = past && !nearEnd && !allOut;

  return (
    <>
      <div
        inert={!visible}
        aria-hidden={!visible}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-30 border-t border-obsidian/10 bg-ivory/95 backdrop-blur-md transition-[transform,visibility] duration-500 ease-[var(--ease-out)] lg:hidden",
          visible ? "visible translate-y-0" : "invisible translate-y-full",
        )}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="gutter flex items-center gap-4 pt-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.875rem]">{product.name}</p>
            <p className="truncate text-[0.75rem] text-stone tabular-nums">
              {variant ? formatPrice(variant.price) : formatPriceRange(min, max)} · {FINISH_LABEL[finish]}
              {size ? ` · ${size}` : ""}
            </p>
            {note && (
              <p role="alert" className="text-[0.75rem] text-error">
                {note}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={act}
            disabled={soldOut}
            className="eyebrow min-h-12 shrink-0 bg-obsidian px-5 text-ivory disabled:opacity-40"
          >
            {label}
          </button>
        </div>
      </div>
      <Dialog
        open={sheet}
        onClose={() => setSheet(false)}
        side="bottom"
        label={`Choose options for ${product.name}`}
        title={product.name}
      >
        <div className="gutter flex-1 overflow-y-auto overscroll-contain py-6">
          <PurchasePanel product={product} selection={selection} showBuyNow={false} onAdded={() => setSheet(false)} />
        </div>
      </Dialog>
    </>
  );
}
