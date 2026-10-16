"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { IconExpand } from "@/components/ui/icons";
import { ProductMedia, photosFor } from "./ProductMedia";
import { ImageViewer } from "./ImageViewer";

/**
 * Real photography only — the photos for the selected finish (`photosFor`).
 * Phone: full-bleed scroll-snap carousel (count + dots only when there is more than one photo).
 * Tablet/desktop: 2-up native 9:16 frames (each ≤ ~450 CSS px, so 768px studio shots are never upscaled),
 * or a single 4:5 frame when the finish has one photo. Any image opens the zoom viewer.
 * Remount per finish (`key`) so switching finish resets to the first photo.
 */
export function Gallery({ product, finish }: { product: Product; finish: Finish }) {
  const photos = photosFor(product, finish);
  const n = Math.max(1, photos.length);
  const single = n === 1;
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const track = useRef<HTMLUListElement>(null);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div
      aria-roledescription={single ? undefined : "carousel"}
      aria-label={`${product.name} images`}
      className="fade-in"
    >
      <div className="relative">
        <ul
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
            if (i !== index) setIndex(i);
          }}
          className={clsx(
            "no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:grid md:snap-none md:overflow-visible",
            single ? "md:grid-cols-1" : "md:grid-cols-2 md:gap-[var(--grid-gap)]",
          )}
        >
          {Array.from({ length: n }, (_, v) => {
            const alt = photos[v]?.alt ?? product.name;
            return (
              <li
                key={photos[v]?.src ?? v}
                className={clsx(
                  "w-full shrink-0 snap-center snap-always md:w-auto",
                  // single portrait photo: keep it portrait and never taller than the screen (tablet + phone landscape)
                  single && "md:max-lg:mx-auto md:max-lg:w-[min(100%,calc((100svh-var(--header-h))*0.8))] lg:max-w-[768px]",
                )}
                aria-roledescription={single ? undefined : "slide"}
                aria-label={single ? undefined : `${v + 1} of ${n}`}
              >
                <button
                  type="button"
                  onClick={() => setViewer(v)}
                  className={clsx(
                    "group relative block w-full overflow-hidden bg-paper lg:cursor-zoom-in",
                    "aspect-[4/5]", !single && "md:aspect-[9/16]",
                  )}
                  aria-label={`Enlarge image${single ? "" : ` ${v + 1} of ${n}`}: ${alt}`}
                >
                  <ProductMedia
                    product={product}
                    finish={finish}
                    view={v}
                    priority={v === 0}
                    sizes={single ? "(min-width:1024px) 46vw, (min-width:768px) 768px, 100vw" : "(min-width:1024px) 30vw, (min-width:768px) 48vw, 100vw"}
                    className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] lg:group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 bottom-4 hidden size-10 place-items-center bg-ivory/85 text-obsidian opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 lg:grid"
                  >
                    <IconExpand size={18} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {!single && (
          <>
            <p
              className="eyebrow pointer-events-none absolute top-4 right-4 bg-ivory/80 px-2 py-1 text-obsidian tabular-nums md:hidden"
              aria-live="polite"
            >
              {index + 1} / {n}
            </p>
            <div className="absolute inset-x-0 bottom-1 flex justify-center md:hidden">
              {Array.from({ length: n }, (_, v) => (
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
                      "block h-[3px] bg-obsidian transition-[width,opacity] duration-500",
                      index === v ? "w-6" : "w-3 opacity-40",
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
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
