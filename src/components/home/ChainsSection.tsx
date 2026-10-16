import Link from "next/link";
import clsx from "clsx";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";
import { getAllProducts, getCategory, styleSlug, stylesOf } from "@/lib/catalog";
import { FrameCaption, SectionHead } from "./SectionHead";

/**
 * Phone: a swipe of native 9:16 portraits. Desktop: an asymmetric set — one tall portrait,
 * two shorter 4:5 frames stepped beside it (the extras stay in the phone swipe only).
 */
const FRAMES = [
  { id: "product-locket-onyx-gold-herringbone", href: "/product/onyx-square-locket?finish=gold", name: "Onyx Square Locket", note: "Locket", focus: "50% 45%", desk: "lead" },
  { id: "product-chain-rope-silver", href: "/product/rope-chain", name: "Rope Chain", note: "Rope", focus: "50% 32%", desk: "top" },
  { id: "product-locket-zulfiqar-silver", href: "/product/zulfiqar-pendant", name: "Zulfiqar Pendant", note: "Locket", focus: "50% 50%", desk: "bottom" },
  { id: "product-chain-herringbone-silver", href: "/product/herringbone-chain", name: "Herringbone Chain", note: "Herringbone", focus: "50% 30%", desk: null },
  { id: "product-locket-wing-silver", href: "/product/wing-pendant", name: "Wing Pendant", note: "Locket", focus: "50% 45%", desk: null },
] as const;

/** 02 — Chain & Lockets. Text and style index on the left; portraits on the right. */
export function ChainsSection() {
  const cat = getCategory("chains")!;
  // catalogue order: Cuban link, Rope, Herringbone, Franco, Snake, Box, Locket
  const products = getAllProducts().filter((p) => p.category === "chains");
  const styles = stylesOf(products).map((s) => ({
    label: s,
    href: `/shop/chains?style=${styleSlug(s)}`,
    count: products.filter((p) => p.subcategory === s).length,
  }));

  return (
    <section aria-labelledby="chains-title" className="section bg-ivory">
      <div className="wrap">
        <SectionHead n="02" label={cat.name} href="/shop/chains" cta="Shop all" />

        <div className="mt-8 grid gap-y-10 lg:mt-12 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
          <div className="lg:col-span-4">
            <h2 id="chains-title" className="t-h2 reveal">
              Worn close.
              <br />
              <em>Seen first.</em>
            </h2>
            <p className="reveal mt-5 max-w-[26rem] text-stone" style={{ "--d": "100ms" } as React.CSSProperties}>
              Cuban, rope, herringbone, Franco, snake and box chains — and the lockets that hang from them.
            </p>

            <nav aria-label="Chain styles" className="mt-8 lg:mt-12">
              <ul className="reveal-stagger flex flex-wrap gap-2 lg:block lg:border-t lg:border-obsidian/10">
                {styles.map((s) => (
                  <li key={s.href} className="lg:border-b lg:border-obsidian/10">
                    <Link
                      href={s.href}
                      className={clsx(
                        "group link-arrow flex min-h-11 items-center gap-3 border border-obsidian/15 px-4 text-sm transition-colors hover:border-obsidian",
                        "lg:min-h-14 lg:justify-between lg:border-0 lg:px-0 lg:text-base",
                      )}
                    >
                      <span className="link-line link-group">{s.label}</span>
                      <span className="hidden items-center gap-4 text-stone lg:flex">
                        <span className="t-small tabular-nums">{String(s.count).padStart(2, "0")}</span>
                        <IconArrow size={16} className="text-obsidian" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <ul
            aria-label="Chain & Lockets, as worn"
            className={clsx(
              "no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-[var(--grid-gap)] overflow-x-auto px-[var(--gutter)]",
              "lg:col-span-7 lg:col-start-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0",
            )}
          >
            {FRAMES.map((f, i) => (
              <li
                key={f.id}
                className={clsx(
                  "w-[58vw] shrink-0 snap-start sm:w-[36vw] lg:w-auto",
                  f.desk === "lead" && "lg:col-span-4 lg:row-span-2",
                  f.desk === "top" && "lg:col-span-3 lg:col-start-5 lg:row-start-1 lg:self-end",
                  f.desk === "bottom" && "lg:col-span-3 lg:col-start-5 lg:row-start-2",
                  f.desk === null && "lg:hidden",
                )}
              >
                <Link href={f.href} className="group block">
                  <div
                    className={clsx("relative overflow-hidden", i < 3 ? "reveal-mask" : "")}
                    style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
                  >
                    <div className={clsx("ratio-tall", f.desk === "top" || f.desk === "bottom" ? "lg:hidden" : "")} />
                    {(f.desk === "top" || f.desk === "bottom") && <div className="ratio-portrait hidden lg:block" />}
                    <div className="frame-zoom absolute inset-0">
                      <Photo
                        id={f.id}
                        sizes={f.desk === "lead" ? "(min-width:1024px) 28vw, 58vw" : "(min-width:1024px) 21vw, 58vw"}
                        position={f.focus}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                  <FrameCaption name={f.name} note={f.note} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
