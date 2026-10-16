import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";
import { priceRange, queryProducts } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { SectionRule } from "./SectionRule";

/**
 * 05 — Rings. Overlapping, off-axis photographs; a vertical title on desktop;
 * products as a numbered index rather than cards.
 */
export function RingsSection() {
  const rings = queryProducts({ category: "rings" });
  return (
    <section aria-labelledby="rings-title" className="overflow-hidden bg-ivory py-14 text-obsidian lg:py-28">
      <div className="gutter mx-auto max-w-[1800px]">
        <SectionRule n="05" label="Rings" aside="Hand-held statements" />

        <div className="mt-10 grid grid-cols-12 gap-x-3 gap-y-10 lg:mt-16 lg:gap-x-6">
          {/* vertical title (desktop) */}
          <h2
            id="rings-title"
            className="display col-span-12 text-[clamp(3.5rem,16vw,6rem)] leading-[0.8] lg:col-span-1 lg:rotate-180 lg:self-start lg:text-[5.2vw] lg:[writing-mode:vertical-rl]"
          >
            Rings
          </h2>

          {/* photo pair */}
          <div className="relative col-span-12 lg:col-span-7 lg:col-start-2 lg:pl-[2vw]">
            <figure className="group reveal w-[82%] lg:w-[78%]">
              <Photo
                id="brand-sword-ring-marble"
                mono
                sizes="(min-width:1024px) 42vw, 82vw"
                position="50% 50%"
                className="aspect-square"
              />
              <figcaption className="mt-2 flex justify-between gap-3 text-xs">
                <span className="font-semibold">Sword wrap ring</span>
                <span className="text-stone">Diamentory studio</span>
              </figcaption>
            </figure>
            <div className="reveal absolute right-0 bottom-[-2.5rem] w-[46%] border-[6px] border-ivory lg:bottom-[-4rem] lg:w-[40%] lg:border-[10px]">
              <Photo id="editorial-bw-rings-hand-portrait" sizes="(min-width:1024px) 22vw, 46vw" alt="" position="50% 40%" className="aspect-[3/4]" />
            </div>
          </div>

          {/* index */}
          <div className="col-span-12 mt-10 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end">
            <p className="reveal max-w-sm text-[0.95rem] leading-relaxed text-graphite">
              Bands, signets and sculptural wraps — small in size, never in presence.
            </p>
            <ol className="reveal mt-6 border-t border-obsidian">
              {rings.map((p, i) => {
                const { min, max } = priceRange(p);
                return (
                  <li key={p.slug} className="border-b border-obsidian/15">
                    <Link href={`/product/${p.slug}`} className="group grid min-h-14 grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-3">
                      <span className="text-xs font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[0.95rem] font-medium transition-transform group-hover:translate-x-1">{p.name}</span>
                      <span className="text-sm tabular-nums text-stone">{formatPriceRange(min, max)}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <Link
              href="/shop/rings"
              className="eyebrow mt-6 inline-flex min-h-12 items-center gap-3 bg-obsidian px-6 text-ivory transition-colors hover:bg-accent"
            >
              Shop rings <IconArrow size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
