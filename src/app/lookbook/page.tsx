import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { SITE } from "@/content/site";
import { getProduct } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";
import { STUDIES } from "@/components/home/studies";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Styled moments from Diamentory — still-life studies in gold, silver, black and two-tone, with links to shop each piece.",
  alternates: { canonical: "/lookbook" },
  openGraph: { title: "Lookbook — DIAMENTORY", url: "/lookbook" },
};

/** Magazine-like placement per study (12-col on desktop, 12-col asymmetric on mobile). */
const LAYOUT: { place: string; aspect: string }[] = [
  { place: "col-span-12 lg:col-span-7", aspect: "aspect-[4/5] lg:aspect-[5/4]" },
  { place: "col-span-8 col-start-5 lg:col-span-4 lg:col-start-9 lg:mt-40", aspect: "aspect-[3/4]" },
  { place: "col-span-7 lg:col-span-4 lg:col-start-2 lg:-mt-24", aspect: "aspect-[4/5]" },
  { place: "col-span-5 col-start-8 mt-24 lg:col-span-3 lg:col-start-7 lg:mt-12", aspect: "aspect-[3/4]" },
  { place: "col-span-10 col-start-2 lg:col-span-5 lg:col-start-8 lg:mt-24", aspect: "aspect-square" },
  { place: "col-span-6 lg:col-span-3 lg:col-start-1", aspect: "aspect-[3/5]" },
  { place: "col-span-6 mt-20 lg:col-span-5 lg:col-start-5 lg:mt-32", aspect: "aspect-[5/4]" },
  { place: "col-span-9 lg:col-span-3 lg:col-start-10 lg:-mt-12", aspect: "aspect-[3/4]" },
  { place: "col-span-12 lg:col-span-8 lg:col-start-3 lg:mt-12", aspect: "aspect-[4/5] lg:aspect-[16/10]" },
];

export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-[var(--gutter)] pt-14 pb-24 lg:pt-24 lg:pb-40">
      <header className="grid grid-cols-12 gap-x-3 lg:gap-x-6">
        <p className="eyebrow col-span-12 text-stone lg:col-span-3">Styled moments</p>
        <h1 className="display col-span-12 mt-4 text-[clamp(3.25rem,16vw,12rem)] lg:col-span-9 lg:mt-0">
          Look<em className="italic">book.</em>
        </h1>
        <p className="col-span-12 mt-6 max-w-[42ch] text-[0.95rem] leading-relaxed text-graphite lg:col-span-5 lg:col-start-4">
          Still-life studies in finish, form and contrast. Each one is a starting point — shop the piece, then make it yours.
        </p>
        <p className="col-span-12 mt-3 text-[0.75rem] text-stone lg:col-span-5 lg:col-start-4">
          Illustrated studies shown while photography is in production.
        </p>
      </header>

      <ol className="mt-16 grid grid-cols-12 gap-x-3 gap-y-14 lg:mt-28 lg:gap-x-6 lg:gap-y-20">
        {STUDIES.map((s, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          const product = getProduct(s.product);
          return (
            <li key={s.id} id={s.id} className={clsx("reveal scroll-mt-[calc(var(--header-h)+1.5rem)]", l.place)}>
              <figure>
                <div className={clsx("relative overflow-hidden", l.aspect)}>
                  <JewelArt
                    form={s.form}
                    finish={s.finish}
                    tone={s.tone}
                    crop={s.crop}
                    rotate={s.rotate}
                    title={`${s.title}: ${s.note}`}
                    className="absolute inset-0"
                  />
                </div>
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="flex items-baseline gap-3">
                    <span className="eyebrow text-stone tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[1.5rem] lg:text-[1.9rem]">{s.title}</span>
                  </span>
                  <span className="w-full text-[0.82rem] text-stone">{s.note}</span>
                  {product && (
                    <Link href={`/product/${product.slug}?finish=${s.finish}`} className="inline-flex min-h-11 items-center py-2 text-[0.82rem] font-medium">
                      <span className="link-line">Shop the {product.name}</span>
                      <span aria-hidden="true" className="ml-2">→</span>
                    </Link>
                  )}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="lb-more" className="mt-24 border-t border-obsidian/10 pt-10 lg:mt-40 lg:flex lg:items-end lg:justify-between">
        <h2 id="lb-more" className="display text-[clamp(2rem,8vw,4.5rem)]">
          More on <em className="italic">Instagram.</em>
        </h2>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:mt-0">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex min-h-12 items-center justify-center bg-obsidian px-8 text-ivory transition-colors hover:bg-graphite"
          >
            {SITE.instagramHandle} <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link
            href="/collections"
            className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-8 transition-colors hover:bg-obsidian hover:text-ivory"
          >
            Explore Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
