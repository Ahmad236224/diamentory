"use client";

import Link from "next/link";
import clsx from "clsx";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { ProductMedia } from "@/components/product/ProductMedia";
import { QtyStepper } from "@/components/ui/QtyStepper";

const FINISH_LABEL: Record<string, string> = { gold: "Gold", silver: "Silver", black: "Black", "two-tone": "Two-Tone" };

export function CartLines({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const cart = useCart();
  return (
    <ul className="divide-y divide-obsidian/10">
      {cart.lines.map((l) => {
        const p = l.product;
        const v = l.variant;
        return (
          <li key={l.variantId} className={clsx("flex gap-4", compact ? "py-5" : "py-6 sm:gap-6")}>
            <div className={clsx("shrink-0", compact ? "w-24" : "w-28 sm:w-36")}>
              {p ? (
                <Link href={`/product/${p.slug}`} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
                  <ProductMedia product={p} finish={v?.finish} className="aspect-[4/5]" sizes="150px" />
                </Link>
              ) : (
                <div className="aspect-[4/5] bg-line" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {p ? (
                    <Link href={`/product/${p.slug}`} onClick={onNavigate} className="link-line text-[0.95rem]">
                      {p.name}
                    </Link>
                  ) : (
                    <span className="text-[0.95rem]">Item no longer available</span>
                  )}
                  {v && (
                    <p className="mt-1 text-xs text-stone">
                      {FINISH_LABEL[v.finish]}
                      {v.size ? ` · ${v.size}` : ""}
                    </p>
                  )}
                </div>
                {v && <p className="shrink-0 text-sm tabular-nums">{formatPrice(v.price * l.qty)}</p>}
              </div>

              {l.priceChanged && v && (
                <p className="mt-2 text-xs text-graphite">
                  Price updated from {formatPrice(l.priceAtAdd)} to {formatPrice(v.price)}.
                </p>
              )}
              {l.issue && (
                <p role="alert" className="mt-2 text-xs text-error">
                  {l.issue === "sold-out" && "This option has sold out. Please remove it to continue."}
                  {l.issue === "unavailable" && "This item is no longer available. Please remove it to continue."}
                  {l.issue === "reduced" && `Only ${l.maxQty} available. Please reduce the quantity.`}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                {v && l.issue !== "sold-out" && l.issue !== "unavailable" ? (
                  <QtyStepper
                    value={l.qty}
                    min={1}
                    max={Math.max(l.maxQty, 1)}
                    onChange={(n) => cart.setQty(l.variantId, n)}
                    label={p?.name ?? "item"}
                  />
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => cart.remove(l.variantId)}
                  className="link-line min-h-11 text-xs tracking-wide text-stone underline-offset-4 hover:text-obsidian"
                >
                  Remove<span className="sr-only"> {p?.name}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
