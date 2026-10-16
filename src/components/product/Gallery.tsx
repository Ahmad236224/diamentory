"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { IconExpand } from "@/components/ui/icons";
import { ProductMedia } from "./ProductMedia";
import { ImageViewer } from "./ImageViewer";

export const VIEWS = [0, 1, 2, 3] as const;
export const VIEW_LABEL = ["Front", "Detail", "Angle", "On dark"];

/**
 * Mobile: full-bleed scroll-snap carousel with count + dots.
 * Desktop: editorial stacked grid. Any image opens the zoom viewer.
 */
export function Gallery({ product, finish }: { product: Product; finish: Finish }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const track = useRef<HTMLUListElement>(null);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const open = (i: number) => setViewer(i);

  return (
    <div aria-roledescription="carousel" aria-label={`${product.name} images`}>
      {/* One list: scroll-snap carousel below lg, editorial grid from lg (no duplicate SVG ids). */}
      <div className="relative">
        <ul
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
            if (i !== index) setIndex(i);
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible"
        >
          {VIEWS.map((v) => (
            <li
              key={v}
              className={clsx("w-full shrink-0 snap-center snap-always lg:w-auto", (v === 0 || v === 3) && "lg:col-span-2")}
              aria-roledescription="slide"
              aria-label={`${v + 1} of ${VIEWS.length}: ${VIEW_LABEL[v]}`}
            >
              <button
                type="button"
                onClick={() => open(v)}
                className={clsx(
                  "group relative block aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:cursor-zoom-in",
                  v === 0 ? "lg:aspect-[5/5.4]" : v === 3 ? "lg:aspect-[16/10]" : "lg:aspect-[4/5]",
                )}
                aria-label={`Enlarge image ${v + 1}: ${VIEW_LABEL[v]}`}
              >
                <ProductMedia
                  product={product}
                  finish={finish}
                  view={v}
                  priority={v === 0}
                  sizes="(min-width:1024px) 55vw, 100vw"
                  className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] lg:group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute right-4 bottom-4 hidden size-10 place-items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 lg:grid",
                    v === 3 ? "bg-obsidian/60 text-ivory" : "bg-ivory/85 text-obsidian",
                  )}
                >
                  <IconExpand size={18} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p
          className={clsx(
            "eyebrow pointer-events-none absolute top-4 right-4 px-2 py-1 tabular-nums tracking-[0.18em] lg:hidden",
            index === 3 ? "text-champagne" : "bg-ivory/80 text-obsidian",
          )}
          aria-live="polite"
        >
          {index + 1} / {VIEWS.length}
        </p>
        <div className="absolute inset-x-0 bottom-1 flex justify-center lg:hidden">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => goTo(v)}
              aria-label={`Show image ${v + 1}`}
              aria-current={index === v ? "true" : undefined}
              className="grid size-11 place-items-center"
            >
              <span
                className={clsx(
                  "block h-[3px] transition-all duration-500",
                  index === v ? "w-6" : "w-3 opacity-40",
                  index === 3 ? "bg-ivory" : "bg-obsidian",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <ImageViewer
        product={product}
        finish={finish}
        index={viewer}
        onIndex={(i) => {
          setViewer(i);
          goTo(i);
        }}
        onClose={() => setViewer(null)}
      />
    </div>
  );
}
