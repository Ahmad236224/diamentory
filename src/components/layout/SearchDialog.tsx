"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { CATEGORIES, queryProducts, priceRange } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { IconArrow, IconClose, IconSearch } from "@/components/ui/icons";
import { ProductMedia } from "@/components/product/ProductMedia";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const listId = useId();
  const results = useMemo(() => (q.trim().length > 1 ? queryProducts({ q }).slice(0, 6) : []), [q]);

  return (
    <Dialog open={open} onClose={onClose} side="top" label="Search" hideTitle>
      <form
        role="search"
        className="gutter mx-auto flex w-full max-w-[1800px] items-center gap-3 border-b border-obsidian/10 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q.trim()) return;
          onClose();
          router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <IconSearch className="shrink-0" />
        <label htmlFor={`${listId}-q`} className="sr-only">
          Search the collection
        </label>
        <input
          id={`${listId}-q`}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chains, rings, finishes…"
          className="h-12 min-w-0 flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-stone md:text-3xl"
          aria-controls={listId}
        />
        <button type="button" onClick={onClose} className="-mr-3 grid size-11 shrink-0 place-items-center" aria-label="Close search">
          <IconClose />
        </button>
      </form>
      <div id={listId} className="gutter mx-auto w-full max-w-[1800px] overflow-y-auto py-6" aria-live="polite">
        {q.trim().length > 1 ? (
          results.length ? (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {results.map((p) => {
                  const { min, max } = priceRange(p);
                  return (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} onClick={onClose} className="group block">
                        <ProductMedia product={p} className="aspect-[4/5]" sizes="(min-width:1024px) 16vw, 45vw" />
                        <p className="mt-2 text-sm">{p.name}</p>
                        <p className="text-xs text-stone">{formatPriceRange(min, max)}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(q.trim())}`}
                onClick={onClose}
                className="eyebrow mt-6 inline-flex min-h-11 items-center gap-2"
              >
                View all results <IconArrow size={16} />
              </Link>
            </>
          ) : (
            <p className="text-stone">No pieces match “{q}”. Try “chain”, “ring” or a finish like “black”.</p>
          )
        ) : (
          <div>
            <p className="eyebrow text-stone">Browse</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop/${c.slug}`}
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center border border-obsidian/15 px-4 text-sm transition-colors hover:bg-obsidian hover:text-ivory"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
}
