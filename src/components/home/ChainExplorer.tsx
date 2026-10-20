"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { IconArrow } from "@/components/ui/icons";

export type ChainStyle = {
  label: string;
  count: number;
  /** Filtered shop listing for this style. */
  href: string;
  /** The product shown for this style (a real catalogue item). */
  product: { name: string; href: string };
  image: { src: string; alt: string; focus: string };
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Chain & Lockets index. Desktop: hovering or focusing a style crossfades the featured photograph;
 * clicking opens that style. Touch: style chips select (no navigation), with an explicit CTA below.
 * Every photo is layered in one frame, so switching never shows an empty box.
 */
export function ChainExplorer({ styles }: { styles: ChainStyle[] }) {
  const [active, setActive] = useState(0);
  // announce only tap selections (hover/focus already speak for themselves)
  const [announce, setAnnounce] = useState(false);
  if (!styles.length) return null;
  const cur = styles[active] ?? styles[0];

  return (
    <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:mt-12 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
      {/* Text + desktop index */}
      <div className="flex min-w-0 flex-col lg:col-span-5">
        <h2 id="chains-title" className="t-h2 reveal">
          Worn close.
          <br />
          <em>Seen first.</em>
        </h2>
        <p className="reveal mt-5 max-w-[24rem] text-pretty text-stone" style={{ "--d": "100ms" } as React.CSSProperties}>
          Every style, photographed as worn.
        </p>

        <nav aria-label="Chain styles" className="mt-auto hidden pt-12 lg:block">
          <ol className="reveal-stagger border-t border-obsidian/10">
            {styles.map((s, i) => (
              <li key={s.href} className="border-b border-obsidian/10">
                <Link
                  href={s.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={clsx(
                    "chain-row group grid min-h-16 grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-2 xl:min-h-[4.75rem]",
                    i === active ? "text-obsidian" : "text-obsidian/35 hover:text-obsidian",
                  )}
                  data-active={i === active || undefined}
                >
                  <span className="t-small tabular-nums">{pad(i + 1)}</span>
                  <span className="chain-row-name font-serif text-[1.5rem] leading-none tracking-[-0.03em] uppercase xl:text-[1.875rem]">
                    {s.label}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="t-small tabular-nums text-stone">
                      {s.count} {s.count === 1 ? "piece" : "pieces"}
                    </span>
                    <IconArrow size={16} className="chain-row-arrow" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Featured photograph */}
      <figure className="min-w-0 lg:col-span-6 lg:col-start-7">
        <Link href={cur.product.href} className="group block" aria-label={`${cur.product.name} — view piece`}>
          <div className="reveal-mask relative overflow-hidden bg-paper max-lg:-mx-[var(--gutter)]">
            <div className="ratio-portrait" />
            <div className="frame-zoom absolute inset-0">
              <div className="absolute inset-0">
                {styles.map((s, i) => (
                  <Image
                    key={s.image.src}
                    src={s.image.src}
                    alt={i === active ? s.image.alt : ""}
                    aria-hidden={i === active ? undefined : true}
                    fill
                    sizes="(min-width:1024px) 46vw, 100vw"
                    className={clsx("chain-shot object-cover", i === active && "is-active")}
                    style={{ objectPosition: s.image.focus }}
                  />
                ))}
              </div>
            </div>
            <span className="eyebrow absolute top-4 right-4 bg-ivory px-2 py-1 tabular-nums">
              {pad(active + 1)} / {pad(styles.length)}
            </span>
          </div>
        </Link>

        {/* Touch: tap to select */}
        <div role="group" aria-label="Choose a chain style" className="no-scrollbar -mx-[var(--gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--gutter)] lg:hidden">
          {styles.map((s, i) => (
            <button
              key={s.href}
              type="button"
              aria-pressed={i === active}
              onClick={(e) => {
                e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                setActive(i);
                setAnnounce(true);
              }}
              className={clsx(
                "min-h-11 shrink-0 border px-4 text-sm transition-colors duration-[var(--dur-1)]",
                i === active ? "border-obsidian bg-obsidian text-ivory" : "border-obsidian/15 text-obsidian",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3" aria-live={announce ? "polite" : "off"}>
          <Link href={cur.product.href} className="link-arrow inline-flex min-h-11 items-center gap-2">
            <span className="link-line font-medium">{cur.product.name}</span>
            <IconArrow size={14} />
          </Link>
          <Link href={cur.href} className="eyebrow link-arrow inline-flex min-h-11 items-center gap-2 text-stone hover:text-obsidian">
            <span className="link-line">
              Shop {cur.label} · {cur.count}
            </span>
            <IconArrow size={14} />
          </Link>
        </figcaption>
      </figure>
    </div>
  );
}
