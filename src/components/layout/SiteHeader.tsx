"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_PRIMARY } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";
import { IconBag, IconMenu, IconSearch } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";

export function SiteHeader() {
  const cart = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-obsidian/10 bg-ivory">
        <div className="gutter mx-auto grid h-[var(--header-h)] max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center">
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
              <ul className="flex items-center gap-7">
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
          <Link href="/" className="wordmark text-[1.05rem] sm:text-[1.15rem] lg:text-[1.35rem]" aria-label="Diamentory — home">
            Diamentory
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-1 lg:gap-6">
            <Link href="/new-arrivals" className="eyebrow link-line hidden py-2 lg:inline">
              New
            </Link>
            <Link href="/collections" className="eyebrow link-line hidden py-2 xl:inline">
              Collections
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center lg:w-auto lg:gap-2 lg:[grid-auto-flow:column]"
              aria-label="Search"
              aria-haspopup="dialog"
              onClick={() => setSearch(true)}
            >
              <IconSearch />
              <span className="eyebrow hidden lg:inline">Search</span>
            </button>
            <button
              type="button"
              className="-mr-3 grid h-11 min-w-11 place-items-center px-2 lg:mr-0 lg:px-0 [grid-auto-flow:column] gap-1.5"
              aria-label={`Bag, ${cart.hydrated ? cart.count : 0} ${cart.hydrated && cart.count === 1 ? "item" : "items"}`}
              aria-haspopup="dialog"
              onClick={cart.open}
            >
              <IconBag className="lg:hidden" />
              <span className="eyebrow hidden lg:inline" aria-hidden="true">Bag</span>
              <span className="min-w-[1ch] text-xs font-semibold tabular-nums" aria-hidden="true">
                {cart.hydrated && cart.count > 0 ? <span className="lg:hidden">{cart.count}</span> : ""}
                <span className="hidden lg:inline">({cart.hydrated ? cart.count : 0})</span>
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
