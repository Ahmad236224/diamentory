import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";
import { priceRange, queryProducts } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { SectionRule } from "./SectionRule";

/**
 * 03 — Tennis. Quiet and precise: off-white field, one tight macro, small type,
 * a text-only product index. Everything the Cuban chapter is not.
 */
export function TennisSection() {
  const items = queryProducts({ q: "tennis" });
  return (
    <section aria-labelledby="tennis-title" className="bg-paper py-14 text-obsidian lg:py-28">
      <div className="gutter mx-auto max-w-[1800px]">
        <SectionRule n="03" label="Tennis" aside="Set in line" />

        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 lg:mt-20">
          <div className="col-span-12 lg:col-span-4 lg:pt-6">
            <h2 id="tennis-title" className="reveal font-serif text-[clamp(2.4rem,5.4vw,5.2rem)] uppercase">
              Light,
              <br />
              <em>in a line.</em>
            </h2>
            <p className="reveal mt-6 max-w-xs text-[0.95rem] leading-relaxed text-graphite">
              Stone after stone, each in its own setting. Fluid on the neck and the wrist.
            </p>
          </div>

          {/* tight macro, held small in a lot of space */}
          <figure className="reveal col-span-12 lg:col-span-5 lg:col-start-6">
            <Photo
              id="editorial-tennis-bracelet-black"
              sizes="(min-width:1024px) 40vw, 100vw"
              position="50% 55%"
              mono
              alt=""
              className="aspect-[16/10] lg:aspect-[4/3]"
            />
          </figure>

          <div className="col-span-12 lg:col-span-3 lg:col-start-10 lg:self-end">
            <ul className="reveal divide-y divide-obsidian/15 border-y border-obsidian/15">
              {items.map((p) => {
                const { min, max } = priceRange(p);
                return (
                  <li key={p.slug}>
                    <Link href={`/product/${p.slug}`} className="group flex min-h-14 items-center justify-between gap-4 py-3">
                      <span className="text-[0.95rem] font-medium">{p.name}</span>
                      <span className="flex items-center gap-3 text-sm tabular-nums text-stone group-hover:text-obsidian">
                        {formatPriceRange(min, max)}
                        <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href="/search?q=tennis" className="eyebrow link-line mt-5 inline-flex min-h-11 items-center gap-2">
              All tennis pieces <IconArrow size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
