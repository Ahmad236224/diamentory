import Link from "next/link";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { isSoldOut, priceRange, productFinishes } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { ProductMedia, photosFor } from "./ProductMedia";
import { QuickView } from "./QuickView";
import { FINISH_SWATCH, FINISH_LABEL } from "./finishStyle";

export function ProductCard({
  product,
  finish,
  priority,
  sizes,
  className,
  aspect = "ratio-card",
}: {
  product: Product;
  finish?: Finish;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: string;
}) {
  const { min, max } = priceRange(product);
  const finishes = productFinishes(product);
  const soldOut = isSoldOut(product);
  const f = finish && finishes.includes(finish) ? finish : finishes[0];
  const href = `/product/${product.slug}${finish && finishes.includes(finish) ? `?finish=${finish}` : ""}`;

  return (
    <article className={clsx("group relative", className)}>
      <div className="relative">
        <Link href={href} className="block" aria-label={`${product.name}, ${formatPriceRange(min, max)}`}>
          <div className={clsx("relative overflow-hidden", aspect)}>
            <ProductMedia
              product={product}
              finish={f}
              priority={priority}
              sizes={sizes}
              className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
            {photosFor(product, f).length > 1 && (
              <ProductMedia
                product={product}
                finish={f}
                view={1}
                sizes={sizes}
                className="absolute inset-0 opacity-0 transition-opacity duration-700 [@media(hover:hover)]:group-hover:opacity-100"
              />
            )}
          </div>
        </Link>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3">
          {soldOut ? (
            <span className="eyebrow bg-ivory/90 px-2 py-1 text-[0.625rem]">Sold out</span>
          ) : product.isNew ? (
            <span className="eyebrow bg-ivory/90 px-2 py-1 text-[0.625rem]">New</span>
          ) : (
            <span />
          )}
        </div>
        {!soldOut && (
          <div className="absolute right-2 bottom-2">
            <QuickView product={product} finish={f} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[0.875rem] leading-snug font-medium tracking-[-0.005em]">
            <Link href={href} className="link-line">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[0.875rem] text-graphite tabular-nums">{formatPriceRange(min, max)}</p>
        </div>
        <ul className="mt-1 flex shrink-0 gap-1" aria-label="Available finishes">
          {finishes.map((x) => (
            <li key={x} className="size-3 rounded-full ring-1 ring-obsidian/15" style={{ background: FINISH_SWATCH[x] }} title={FINISH_LABEL[x]}>
              <span className="sr-only">{FINISH_LABEL[x]}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
