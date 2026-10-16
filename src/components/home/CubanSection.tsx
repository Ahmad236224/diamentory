import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";
import { queryProducts } from "@/lib/catalog";

/**
 * 02 — Cuban links. Industrial: a full-width word, photography breaking into it,
 * and spec-sheet labelling.
 */
export function CubanSection() {
  const count = queryProducts({ q: "cuban" }).length;
  return (
    <section aria-labelledby="cuban-title" className="overflow-hidden bg-ivory py-14 text-obsidian lg:py-24">
      <div className="gutter mx-auto max-w-[1800px]">
        <div className="reveal flex items-baseline justify-between border-t border-obsidian pt-3">
          <p className="eyebrow">02 — Collection</p>
          <p className="eyebrow text-stone">Cuban link</p>
        </div>

        <h2 id="cuban-title" className="reveal mt-4 lg:mt-6">
          <span aria-hidden className="display block whitespace-nowrap text-[19.2vw] leading-[0.8] tracking-[-0.06em]">
            Cuban
          </span>
          <span className="sr-only">Cuban links</span>
        </h2>

        <div className="relative z-10 -mt-[4vw] grid grid-cols-12 gap-x-3 gap-y-8 lg:-mt-[5vw] lg:gap-x-6">
          {/* Lead: genuine Diamentory iced Cuban */}
          <figure className="group reveal col-span-12 sm:col-span-7 lg:col-span-5">
            <Photo
              id="brand-iced-cuban-bracelet-wrist"
              mono
              sizes="(min-width:1024px) 38vw, (min-width:640px) 58vw, 100vw"
              position="50% 40%"
              className="aspect-[4/5]"
            />
            <figcaption className="mt-3 flex justify-between gap-4 text-xs">
              <span className="font-semibold">Iced Cuban bracelet</span>
              <span className="text-stone">Diamentory studio</span>
            </figcaption>
          </figure>

          {/* Texture */}
          <div className="reveal hidden sm:col-span-5 sm:mt-[22vw] sm:block lg:col-span-3 lg:mt-[16vw]">
            <Photo
              id="editorial-chain-macro-dark-wood"
              sizes="(min-width:1024px) 22vw, 40vw"
              alt=""
              className="aspect-[3/4]"
            />
          </div>

          {/* Spec + action */}
          <div className="col-span-12 flex flex-col justify-between lg:col-span-4 lg:mt-[10vw]">
            <div className="reveal">
              <p className="font-serif text-[clamp(1.5rem,3.2vw,2.6rem)] uppercase leading-[0.95]">
                Links that hold their own.
              </p>
              <dl className="mt-6 divide-y divide-obsidian/15 border-y border-obsidian/15 text-[0.8rem]">
                {[
                  ["Profile", "Interlocking curb"],
                  ["Styles", "Plain · Iced"],
                  ["Worn as", "Chain · Bracelet"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 py-2.5">
                    <dt className="eyebrow text-stone">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="reveal mt-6 flex items-end gap-4">
              <Photo
                id="brand-cuban-bracelets-hand"
                mono
                sizes="7rem"
                position="50% 50%"
                className="hidden aspect-[4/5] w-28 shrink-0 sm:block"
                alt="Diamentory silver and gold Cuban bracelets laid across a palm"
              />
              <Link
                href="/search?q=cuban"
                className="group flex min-h-12 flex-1 items-center justify-between gap-3 bg-obsidian px-5 text-ivory transition-colors hover:bg-accent"
              >
                <span className="eyebrow">Shop Cuban links</span>
                <span className="flex items-center gap-2 text-xs tabular-nums text-ivory/60 group-hover:text-ivory">
                  {count} <IconArrow size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
