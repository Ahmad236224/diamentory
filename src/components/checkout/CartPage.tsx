"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { CartLines } from "@/components/cart/CartLines";
import { NAV_PRIMARY } from "@/content/site";
import { IconArrow } from "@/components/ui/icons";
import { TotalsBlock } from "./OrderSummary";

export function CartPage() {
  const cart = useCart();

  if (!cart.hydrated) return <CartSkeleton />;

  if (cart.lines.length === 0) {
    return (
      <div className="gutter mx-auto max-w-[1800px] pb-24">
        <div className="grid gap-y-10 border-t border-obsidian/10 pt-12 lg:grid-cols-12 lg:gap-x-8 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="display text-[clamp(2.4rem,8vw,5rem)]">
              Nothing here <em>yet.</em>
            </p>
            <p className="mt-5 max-w-[38ch] text-graphite">
              Your bag is empty. Pieces you add are kept on this device until you are ready.
            </p>
            <Link
              href="/shop"
              className="eyebrow mt-9 inline-flex min-h-12 items-center gap-3 bg-obsidian px-7 text-ivory"
            >
              Shop all <IconArrow size={16} />
            </Link>
          </div>
          <nav aria-label="Shop by category" className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow text-stone">Or begin with</p>
            <ul className="mt-4 border-t border-obsidian/10">
              {NAV_PRIMARY.map((n) => (
                <li key={n.href} className="border-b border-obsidian/10">
                  <Link href={n.href} className="group flex min-h-14 items-center justify-between font-serif text-2xl">
                    {n.label}
                    <IconArrow size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  const blocked = cart.hasIssues;
  return (
    <div className="gutter mx-auto grid max-w-[1800px] gap-y-10 pb-24 lg:grid-cols-12 lg:gap-x-8">
      <section aria-labelledby="bag-items-h" className="lg:col-span-7">
        <h2 id="bag-items-h" className="sr-only">
          Items
        </h2>
        {blocked && (
          <div role="status" className="mb-2 border-l-2 border-error bg-error/[0.05] px-4 py-3 text-sm text-error">
            Some items need your attention before checkout — see the notes below.
          </div>
        )}
        <div className="border-t border-obsidian/10">
          <CartLines />
        </div>
        <div className="border-t border-obsidian/10 pt-6">
          <Link href="/shop" className="link-line text-sm text-graphite">
            Continue shopping
          </Link>
        </div>
      </section>

      <aside aria-labelledby="bag-summary-h" className="lg:col-span-4 lg:col-start-9">
        <div className="border border-obsidian/10 p-5 sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <h2 id="bag-summary-h" className="eyebrow mb-6">
            Order summary
          </h2>
          <TotalsBlock subtotal={cart.subtotal} deliveryNote="Calculated at checkout" />
          <div className="mt-7">
            {blocked ? (
              <>
                <button
                  type="button"
                  disabled
                  aria-describedby="checkout-blocked"
                  className="eyebrow inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center bg-obsidian/25 text-ivory"
                >
                  Checkout
                </button>
                <p id="checkout-blocked" className="mt-3 text-xs leading-relaxed text-error">
                  Checkout is paused: remove sold-out or unavailable pieces, or reduce quantities to what is in stock.
                </p>
              </>
            ) : (
              <Link
                href="/checkout"
                className="eyebrow inline-flex min-h-12 w-full items-center justify-center gap-3 bg-obsidian text-ivory"
              >
                Checkout <IconArrow size={16} />
              </Link>
            )}
          </div>
          <p className="mt-5 border-t border-obsidian/10 pt-5 text-xs leading-relaxed text-stone">
            Online ordering opens soon. You can complete your details at checkout — no order is placed and no payment is
            taken yet.
          </p>
        </div>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="gutter mx-auto grid max-w-[1800px] gap-y-10 pb-24 lg:grid-cols-12 lg:gap-x-8" aria-busy="true">
      <p className="sr-only" role="status">
        Loading your bag…
      </p>
      <div className="border-t border-obsidian/10 lg:col-span-7">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4 border-b border-obsidian/10 py-6 sm:gap-6">
            <div className="skeleton aspect-[4/5] w-28 sm:w-36" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-1/3" />
              <div className="skeleton mt-8 h-11 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="skeleton h-72" />
      </div>
    </div>
  );
}
