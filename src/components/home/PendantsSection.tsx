import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";
import { priceRange, queryProducts } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { SectionRule } from "./SectionRule";

/** 06 — Pendants. The piece dominates: one tall studio frame, type tucked to the edge. */
export function PendantsSection() {
  const pendants = queryProducts({ category: "pendants" });
  return (
    <section aria-labelledby="pendants-title" className="bg-obsidian py-14 text-ivory lg:py-24">
      <div className="gutter mx-auto max-w-[1800px]">
        <SectionRule n="06" label="Pendants" aside="A point of focus" tone="dark" />

        <div className="mt-8 grid grid-cols-12 gap-x-3 gap-y-8 lg:mt-12 lg:gap-x-6">
          <figure className="group reveal col-span-12 sm:col-span-8 lg:col-span-6">
            <Photo
              id="brand-ali-pendant-snake-chain"
              sizes="(min-width:1024px) 46vw, (min-width:640px) 64vw, 100vw"
              position="50% 55%"
              className="aspect-[4/5] lg:aspect-[3/4]"
            />
            <figcaption className="mt-2 flex justify-between gap-3 text-xs">
              <span className="font-semibold">Arabic name pendant — “Ali”</span>
              <span className="text-champagne">Diamentory studio</span>
            </figcaption>
          </figure>

          <div className="col-span-12 flex flex-col justify-between gap-10 sm:col-span-4 lg:col-span-5 lg:col-start-8">
            <h2 id="pendants-title" className="reveal display text-[clamp(2.5rem,5.8vw,7.5rem)] lg:text-[7vw] leading-[0.82]">
              Hang
              <br />
              <em>it</em> on
              <br />
              you.
            </h2>

            <figure className="group reveal hidden w-[58%] sm:block">
              <Photo id="brand-lightning-pendant-bust" mono sizes="(min-width:1024px) 22vw, 28vw" position="50% 40%" className="aspect-[3/4]" />
              <figcaption className="mt-2 text-xs">Iced lightning pendant</figcaption>
            </figure>

            <div className="reveal">
              <ul className="divide-y divide-ivory/15 border-y border-ivory/15">
                {pendants.map((p) => {
                  const { min, max } = priceRange(p);
                  return (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                        <span className="text-[0.95rem] font-medium">{p.name}</span>
                        <span className="text-sm tabular-nums text-champagne group-hover:text-ivory">{formatPriceRange(min, max)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/shop/pendants" className="eyebrow link-line mt-5 inline-flex min-h-11 items-center gap-2">
                Shop pendants <IconArrow size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
