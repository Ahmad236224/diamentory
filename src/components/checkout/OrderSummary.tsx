"use client";

import { useCart } from "@/components/cart/CartProvider";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Pending } from "@/components/content/Pending";
import { formatPrice } from "@/lib/format";
import { computeTotals } from "@/lib/checkout/totals";
import { lineLabel } from "@/lib/checkout/summary";

/** Subtotal / delivery / total rows — transparent about anything still unconfirmed. */
export function TotalsBlock({ subtotal, deliveryNote }: { subtotal: number; deliveryNote?: string }) {
  const t = computeTotals(subtotal);
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-graphite">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(t.subtotal)}</dd>
      </div>
      <div className="flex items-start justify-between gap-4">
        <dt className="text-graphite">
          Delivery
          {deliveryNote && <span className="block text-xs text-stone">{deliveryNote}</span>}
        </dt>
        <dd className="text-right">
          {t.deliveryPending ? <Pending>To be confirmed</Pending> : t.delivery === 0 ? "Complimentary" : formatPrice(t.delivery!)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-obsidian/10 pt-4">
        <dt className="eyebrow">Total</dt>
        <dd className="text-right">
          <span className="text-xl tabular-nums">{formatPrice(t.total)}</span>
          {t.deliveryPending && <span className="block text-xs text-stone">+ delivery, once confirmed</span>}
        </dd>
      </div>
      <p className="text-xs text-stone">All prices in PKR.</p>
    </dl>
  );
}

/** Read-only line list for the checkout summary. */
export function SummaryLines() {
  const cart = useCart();
  return (
    <ul className="space-y-5">
      {cart.lines.map((l) => (
        <li key={l.variantId} className="flex gap-4">
          <div className="relative w-16 shrink-0">
            {l.product ? (
              <ProductMedia product={l.product} finish={l.variant?.finish} className="aspect-[4/5]" sizes="64px" />
            ) : (
              <div className="aspect-[4/5] bg-line" />
            )}
            <span className="absolute -top-2 -right-2 grid size-6 place-items-center bg-obsidian text-[0.6875rem] text-ivory tabular-nums">
              <span className="sr-only">Quantity </span>
              {l.qty}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm">{l.product?.name ?? "Item no longer available"}</p>
              <p className="mt-0.5 text-xs text-stone">{lineLabel(l)}</p>
              {l.priceChanged && l.variant && (
                <p className="mt-1 text-xs text-graphite">Price updated since added.</p>
              )}
            </div>
            {l.variant && <p className="shrink-0 text-sm tabular-nums">{formatPrice(l.variant.price * l.qty)}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
