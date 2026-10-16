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
    <section aria-labelledby="recent-h" className="border-t border-obsidian/10">
      <div className="wrap section-sm">
        <h2 id="recent-h" className="eyebrow text-stone">
          Recently viewed
        </h2>
        <ul className="product-grid reveal-stagger mt-8">
          {items.map((p, i) => (
            <li key={p.slug} className={i === 3 ? "md:max-lg:hidden" : undefined}>
              <ProductCard product={p} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
