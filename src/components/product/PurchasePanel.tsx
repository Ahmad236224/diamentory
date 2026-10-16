"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { priceRange } from "@/lib/catalog";
import { formatPrice, formatPriceRange } from "@/lib/format";
import { useCart, MAX_QTY } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { FINISH_LABEL, FINISH_SWATCH, useVariantSelection } from "./useVariantSelection";

type Selection = ReturnType<typeof useVariantSelection>;

/** Finish + size selectors, stock line, quantity and purchase buttons. */
export function PurchasePanel({
  product,
  selection,
  onAdded,
  showBuyNow = true,
  ctaRef,
}: {
  product: Product;
  selection: Selection;
  onAdded?: () => void;
  showBuyNow?: boolean;
  ctaRef?: React.Ref<HTMLDivElement>;
}) {
  const cart = useCart();
  const router = useRouter();
  const uid = useId();
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(addedTimer.current), []);
  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);
  const { finishes, sizes, finish, setFinish, size, setSize, needsSize, variant, sizeAvailability, finishAvailable } =
    selection;

  const { min, max } = priceRange(product);
  const stock = variant?.stock ?? 0;
  const maxQty = Math.max(1, Math.min(MAX_QTY, stock));

  // reset quantity/message when the selected variant changes (render-phase adjustment)
  const variantKey = `${variant?.id}|${maxQty}`;
  const [prevKey, setPrevKey] = useState(variantKey);
  if (prevKey !== variantKey) {
    setPrevKey(variantKey);
    setQty((q) => Math.min(q, maxQty));
    setMsg(null);
  }

  function submit(buyNow: boolean) {
    if (needsSize && !size) {
      setMsg({ tone: "error", text: `Please select a ${product.sizeLabel?.toLowerCase() ?? "size"}.` });
      sizeGroupRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    if (!variant || variant.stock <= 0) {
      setMsg({ tone: "error", text: "This combination is sold out. Please choose another option." });
      return;
    }
    const res = cart.add(product.slug, variant.id, qty);
    if (!res.ok) {
      setMsg({ tone: "error", text: res.message ?? "Could not add to bag." });
      return;
    }
    if (buyNow) {
      router.push("/checkout");
      return;
    }
    setMsg({ tone: "ok", text: res.message ?? "Added to your bag." });
    // brief "Added ✓" confirmation on the button, then hand over to the bag drawer
    setAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => {
      setAdded(false);
      onAdded?.();
      cart.open();
    }, 650);
  }

  // Whole finish (or whole product) sold out counts as sold out even before a size is chosen.
  const finishOut = !finishAvailable(finish);
  const soldOut = finishOut || (!!variant && variant.stock <= 0);

  return (
    <div>
      <p className="text-lg tabular-nums" aria-live="polite">
        {variant ? formatPrice(variant.price) : formatPriceRange(min, max)}
      </p>

      {/* Finish */}
      <fieldset className="mt-7">
        <legend className="eyebrow flex w-full justify-between">
          <span>Finish</span>
          <span className="normal-case tracking-normal text-stone">{FINISH_LABEL[finish]}</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {finishes.map((f: Finish) => {
            const avail = finishAvailable(f);
            return (
              <label
                key={f}
                className={clsx(
                  "relative flex min-h-11 cursor-pointer items-center gap-2.5 border px-3.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                  f === finish ? "border-obsidian" : "border-obsidian/15 hover:border-obsidian/50",
                  !avail && "text-stone",
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-finish`}
                  value={f}
                  checked={f === finish}
                  onChange={() => setFinish(f)}
                  className="sr-only"
                />
                <span className="size-4 rounded-full ring-1 ring-obsidian/20" style={{ background: FINISH_SWATCH[f] }} aria-hidden="true" />
                {FINISH_LABEL[f]}
                {!avail && <span className="text-xs">— sold out</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Size */}
      {needsSize && (
        <fieldset ref={sizeGroupRef} className="mt-6">
          <legend className="eyebrow flex w-full justify-between">
            <span>{product.sizeLabel ?? "Size"}</span>
            <span className="normal-case tracking-normal text-stone">{size ?? "Select"}</span>
          </legend>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {sizes.map((s) => {
              const a = sizeAvailability(s);
              return (
                <label
                  key={s}
                  className={clsx(
                    "relative grid min-h-11 cursor-pointer place-items-center border text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                    s === size ? "border-obsidian bg-obsidian text-ivory" : "border-obsidian/15 hover:border-obsidian/50",
                    a !== "in" && "cursor-not-allowed text-stone line-through decoration-1",
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-size`}
                    value={s}
                    checked={s === size}
                    disabled={a === "none"}
                    onChange={() => setSize(s)}
                    className="sr-only"
                  />
                  {s}
                  {a === "out" && <span className="sr-only"> (sold out)</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Stock */}
      <p className={clsx("mt-5 min-h-5 text-sm", soldOut ? "text-error" : "text-graphite")} aria-live="polite">
        {finishOut
          ? `Sold out in ${FINISH_LABEL[finish].toLowerCase()}.`
          : variant
          ? soldOut
            ? "Sold out in this combination."
            : stock <= 3
              ? `Only ${stock} left.`
              : "In stock."
          : needsSize
            ? `Select a ${product.sizeLabel?.toLowerCase() ?? "size"} to see availability.`
            : ""}
      </p>

      <div ref={ctaRef} className="mt-4 flex gap-2 [&>[role=group]]:h-12">
        <QtyStepper value={qty} min={1} max={maxQty} onChange={setQty} label={product.name} />
        <button
          type="button"
          onClick={() => !added && submit(false)}
          disabled={soldOut}
          aria-live="polite"
          className="btn btn-dark flex-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? (
            "Sold out"
          ) : added ? (
            <span key="added" className="added-in inline-flex items-center gap-2">
              Added <span aria-hidden="true">✓</span>
            </span>
          ) : (
            "Add to bag"
          )}
        </button>
      </div>
      {showBuyNow && (
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={soldOut}
          className="btn btn-outline mt-2 w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy now
        </button>
      )}
      <p
        role={msg?.tone === "error" ? "alert" : "status"}
        className={clsx("mt-3 min-h-5 text-sm", msg?.tone === "error" ? "text-error" : "text-success")}
      >
        {msg?.text}
      </p>
    </div>
  );
}
