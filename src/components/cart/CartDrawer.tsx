"use client";

import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";
import { useCart } from "./CartProvider";
import { CartLines } from "./CartLines";
import { formatPrice } from "@/lib/format";
import { IconArrow } from "@/components/ui/icons";

export function CartDrawer() {
  const cart = useCart();
  return (
    <Dialog open={cart.isOpen} onClose={cart.close} side="right" label="Bag" title={`Your bag (${cart.count})`}>
      {cart.lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center gutter">
          <p className="font-serif text-4xl">Your bag is empty.</p>
          <p className="mt-3 text-stone">Begin with a signature piece.</p>
          <Link
            href="/shop"
            onClick={cart.close}
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-obsidian px-6 text-ivory eyebrow"
          >
            Shop all <IconArrow size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto overscroll-contain gutter">
            <CartLines compact onNavigate={cart.close} />
          </div>
          <div className="shrink-0 border-t border-obsidian/10 bg-ivory gutter pt-5 safe-bottom">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Subtotal</span>
              <span className="text-lg tabular-nums">{formatPrice(cart.subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-stone">Delivery calculated at checkout.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={cart.close}
                className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian"
              >
                View bag
              </Link>
              <Link
                href="/checkout"
                onClick={cart.close}
                aria-disabled={cart.hasIssues || undefined}
                className="eyebrow inline-flex min-h-12 items-center justify-center bg-obsidian text-ivory"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
