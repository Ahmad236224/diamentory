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
        className="wrap flex items-center gap-3 border-b border-obsidian/10 py-3"
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
          placeholder="Search rings, chains, lockets…"
          className="t-h3 h-12 min-w-0 flex-1 bg-transparent normal-case! outline-none placeholder:text-stone"
          aria-controls={listId}
        />
        <button type="button" onClick={onClose} className="-mr-3 grid size-11 shrink-0 place-items-center" aria-label="Close search">
          <IconClose />
        </button>
      </form>
      <div id={listId} className="wrap overflow-y-auto py-6" aria-live="polite">
        {q.trim().length > 1 ? (
          results.length ? (
            <>
              <ul className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {results.map((p) => {
                  const { min, max } = priceRange(p);
                  return (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} onClick={onClose} className="group block">
                        <ProductMedia product={p} className="ratio-card" sizes="(min-width:1024px) 16vw, 45vw" />
                        <p className="mt-2 text-sm"><span className="link-line link-group">{p.name}</span></p>
                        <p className="text-xs text-stone">{formatPriceRange(min, max)}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(q.trim())}`}
                onClick={onClose}
                className="eyebrow link-arrow mt-6 inline-flex min-h-11 items-center gap-2"
              >
                View all results <IconArrow size={16} />
              </Link>
            </>
          ) : (
            <p className="text-stone">No pieces match “{q}”. Try “chain”, “ring”, “locket” or a finish like “gold”.</p>
          )
        ) : (
          <div>
            <p className="eyebrow text-stone">Shop by category</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop/${c.slug}`}
                    onClick={onClose}
                    className="btn btn-outline"
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
