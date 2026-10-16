import Link from "next/link";
import clsx from "clsx";
import { JewelArt } from "@/components/art/JewelArt";
import { getCategory } from "@/lib/catalog";
import type { ArtForm, CategorySlug, Finish } from "@/lib/catalog/types";
import { SectionHead } from "./SectionHead";

type Tile = {
  slug: CategorySlug;
  num: string;
  form: ArtForm;
  finish: Finish;
  tone: "ivory" | "stone" | "dark";
  crop: [number, number, number, number];
  rotate?: number;
  aspect: string;
  place: string;
  sizes: string;
};

const TILES: Tile[] = [
  {
    slug: "chains",
    num: "i",
    form: "cuban-chain",
    finish: "gold",
    tone: "dark",
    crop: [180, 520, 640, 760],
    rotate: 0,
    aspect: "aspect-[4/5] lg:aspect-[5/8]",
    place: "col-span-10 col-start-1 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start",
    sizes: "(min-width:1024px) 40vw, 80vw",
  },
  {
    slug: "bracelets",
    num: "ii",
    form: "cuban-bracelet",
    finish: "silver",
    tone: "stone",
    crop: [150, 400, 700, 540],
    rotate: -8,
    aspect: "aspect-[5/4]",
    place: "col-span-9 col-start-4 mt-12 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-[18%]",
    sizes: "(min-width:1024px) 40vw, 75vw",
  },
  {
    slug: "rings",
    num: "iii",
    form: "signet-ring",
    finish: "gold",
    tone: "ivory",
    crop: [200, 300, 600, 680],
    rotate: 10,
    aspect: "aspect-[3/4]",
    place: "col-span-6 col-start-1 mt-12 lg:col-span-3 lg:col-start-7 lg:row-start-2 lg:mt-20",
    sizes: "(min-width:1024px) 25vw, 50vw",
  },
  {
    slug: "pendants",
    num: "iv",
    form: "pendant-cross",
    finish: "silver",
    tone: "dark",
    crop: [280, 600, 440, 620],
    rotate: -4,
    aspect: "aspect-[3/5]",
    place: "col-span-6 col-start-7 mt-28 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-32",
    sizes: "(min-width:1024px) 25vw, 50vw",
  },
];

export function CategoryEditorial() {
  return (
    <section aria-labelledby="cat-title" className="gutter mx-auto max-w-[1800px] py-24 lg:py-40">
      <SectionHead
        index="02"
        eyebrow="Shop by category"
        id="cat-title"
        title={
          <>
            Find your <em className="italic">form.</em>
          </>
        }
      />

      <ul className="mt-12 grid grid-cols-12 gap-x-3 lg:mt-20 lg:gap-x-6">
        {TILES.map((t) => {
          const c = getCategory(t.slug);
          if (!c) return null;
          return (
            <li key={t.slug} className={clsx("reveal", t.place)}>
              <Link href={`/shop/${t.slug}`} className="group block">
                <div className={clsx("relative overflow-hidden", t.aspect)}>
                  <JewelArt
                    form={t.form}
                    finish={t.finish}
                    tone={t.tone}
                    crop={t.crop}
                    rotate={t.rotate}
                    className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3 lg:mt-4">
                  <h3 className="flex items-baseline gap-3">
                    <span className="font-serif text-[0.95rem] text-stone italic">{t.num}</span>
                    <span className="display text-[clamp(1.6rem,6.4vw,2.75rem)] group-hover:italic">{c.shortName}</span>
                  </h3>
                  <span aria-hidden="true" className="eyebrow translate-x-0 transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <p className="mt-1 max-w-[34ch] text-[0.8rem] leading-snug text-stone">{c.tagline}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-obsidian/10 pt-6 lg:mt-24">
        <p className="eyebrow text-stone">Also</p>
        <Link href="/shop/sets" className="group inline-flex min-h-11 items-center gap-3">
          <span className="display text-[1.6rem] group-hover:italic lg:text-[2rem]">Sets &amp; Stacks</span>
          <span className="text-[0.8rem] text-stone">— {getCategory("sets")?.tagline}</span>
        </Link>
      </div>
    </section>
  );
}
