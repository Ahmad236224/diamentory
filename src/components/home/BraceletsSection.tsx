import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { ProductCard } from "@/components/product/ProductCard";
import { IconArrow } from "@/components/ui/icons";
import { queryProducts } from "@/lib/catalog";
import { SectionRule } from "./SectionRule";

const STRIP: { id: string; caption?: string; w: string }[] = [
  { id: "brand-iced-link-bracelets-wrist", caption: "Iced link bracelets", w: "w-[68vw] sm:w-[34vw] lg:w-[24vw]" },
  { id: "editorial-bw-chain-bracelet-wrist", w: "w-[52vw] sm:w-[26vw] lg:w-[17vw]" },
  { id: "brand-cuban-bracelets-hand", caption: "Cuban bracelets, silver & gold", w: "w-[68vw] sm:w-[34vw] lg:w-[24vw]" },
  { id: "brand-iced-cuban-bracelets-packaged", caption: "Iced Cuban, ready to ship", w: "w-[52vw] sm:w-[26vw] lg:w-[17vw]" },
];

/** 04 — Bracelets. Black chapter: a swipeable wrist strip, then a short working selection. */
export function BraceletsSection() {
  const picks = queryProducts({ category: "bracelets", inStock: true }).slice(0, 4);
  return (
    <section aria-labelledby="bracelets-title" className="bg-obsidian text-ivory">
      <div className="gutter mx-auto max-w-[1800px] pt-14 lg:pt-24">
        <SectionRule n="04" label="Bracelets" aside="Worn at the wrist" tone="dark" />
        <div className="mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="bracelets-title" className="reveal display text-[clamp(3rem,11vw,10rem)] leading-[0.82]">
            Wrist
            <br />
            work.
          </h2>
          <nav aria-label="Bracelet styles" className="reveal">
            <ul className="flex flex-wrap gap-2">
              {[
                ["Cuban link", "/search?q=cuban+bracelet"],
                ["Tennis", "/search?q=tennis+bracelet"],
                ["Cuffs", "/search?q=cuff"],
                ["Bangles", "/search?q=bangle"],
                ["All bracelets", "/shop/bracelets"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="eyebrow inline-flex min-h-11 items-center border border-ivory/30 px-4 transition-colors hover:border-ivory hover:bg-ivory hover:text-obsidian"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* swipe strip — native scroll-snap, no JS */}
      <ul
        aria-label="Bracelets, as worn"
        className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:mt-14 lg:gap-5"
      >
        {STRIP.map((s, i) => (
          <li key={s.id} className={`group shrink-0 snap-start ${s.w} ${i % 2 ? "self-end" : ""}`}>
            <Photo id={s.id} mono sizes="(min-width:1024px) 24vw, 68vw" className={i % 2 ? "aspect-[3/4]" : "aspect-[4/5]"} alt={s.caption ? undefined : ""} />
            {s.caption && (
              <p className="mt-2 flex justify-between gap-3 text-xs">
                <span>{s.caption}</span>
                <span className="text-champagne">Diamentory</span>
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* working selection on a white sheet */}
      <div className="mt-14 bg-ivory text-obsidian lg:mt-20">
        <div className="gutter mx-auto max-w-[1800px] py-10 lg:py-14">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Shop bracelets</p>
            <Link href="/shop/bracelets" className="eyebrow link-line inline-flex min-h-11 items-center gap-2">
              View all <IconArrow size={14} />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {picks.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width:1024px) 22vw, 46vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
