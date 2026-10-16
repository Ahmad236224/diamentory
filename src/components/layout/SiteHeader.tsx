"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { NAV_PRIMARY } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";
import { IconBag, IconMenu, IconSearch } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";

/**
 * Desktop: the three categories · wordmark · New / Search / Bag.
 * Phone: menu · wordmark · search / bag. The bar stays fixed at the top on every screen size
 * (sticky filter bars sit directly beneath it).
 */
export function SiteHeader() {
  const cart = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const count = cart.hydrated ? cart.count : 0;
  const bump = cart.addSeq > 0 ? "bump" : undefined;

  return (
    <>
      <header className="site-header sticky top-0 z-40 border-b border-obsidian/10 bg-ivory">
        <div className="wrap grid h-[var(--header-h)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
          {/* left */}
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-3 grid size-11 place-items-center lg:hidden"
              aria-label="Open menu"
              aria-haspopup="dialog"
              onClick={() => setMenu(true)}
            >
              <IconMenu size={22} />
            </button>
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV_PRIMARY.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="eyebrow link-line py-2">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* wordmark */}
          <Link href="/" className="wordmark inline-flex min-h-11 items-center text-[0.95rem] xs:text-[1.05rem] sm:text-[1.15rem] lg:text-[1.35rem]" aria-label="Diamentory — home">
            Diamentory
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-1 lg:gap-8">
            <Link href="/new-arrivals" className="eyebrow link-line hidden py-2 lg:inline">
              New
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center lg:w-auto lg:[grid-auto-flow:column] lg:gap-2"
              aria-label="Search"
              aria-haspopup="dialog"
              onClick={() => setSearch(true)}
            >
              <IconSearch className="lg:hidden" />
              <span className="eyebrow link-line hidden lg:inline">Search</span>
            </button>
            <button
              type="button"
              className="relative -mr-3 grid size-11 place-items-center lg:mr-0 lg:w-auto lg:[grid-auto-flow:column] lg:gap-1"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              aria-haspopup="dialog"
              onClick={cart.open}
            >
              <IconBag className="lg:hidden" />
              <span className="eyebrow link-line hidden lg:inline" aria-hidden="true">
                Bag
              </span>
              <span aria-hidden="true" className="hidden text-[0.6875rem] font-semibold tabular-nums lg:inline">
                (<span key={cart.addSeq} className={clsx("inline-block", bump)}>{count}</span>)
              </span>
              {count > 0 && (
                <span
                  key={`m${cart.addSeq}`}
                  aria-hidden="true"
                  className={clsx(
                    "absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-obsidian px-1 text-[0.6875rem] leading-none font-semibold text-ivory tabular-nums lg:hidden",
                    bump,
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
