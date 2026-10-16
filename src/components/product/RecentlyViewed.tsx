"use client";

import { useEffect, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const KEY = "diamentory.recent.v1";
const MAX = 8;

function read(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Records the current product and shows the others recently viewed. Renders nothing when empty. */
export function RecentlyViewed({ current }: { current: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const prev = read();
    const others = prev
      .filter((s) => s !== current)
      .map((s) => getProduct(s))
      .filter((p): p is Product => !!p);
    setItems(others.slice(0, 4)); // eslint-disable-line react-hooks/set-state-in-effect
    try {
      window.localStorage.setItem(KEY, JSON.stringify([current, ...prev.filter((s) => s !== current)].slice(0, MAX)));
    } catch {
      /* storage unavailable */
    }
  }, [current]);

  if (!items.length) return null;

  return (
    <section aria-labelledby="recent-h" className="gutter mx-auto max-w-[1800px] border-t border-obsidian/10 py-16 lg:py-24">
      <h2 id="recent-h" className="eyebrow text-stone">
        Recently viewed
      </h2>
      <ul className="no-scrollbar -mx-[var(--gutter)] mt-8 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        {items.map((p) => (
          <li key={p.slug} className="w-[44vw] shrink-0 snap-start sm:w-[30vw] lg:w-auto">
            <ProductCard product={p} sizes="(min-width:1024px) 22vw, 44vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
