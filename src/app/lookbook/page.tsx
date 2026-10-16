import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { SITE } from "@/content/site";
import { getCategory, getProduct } from "@/lib/catalog";
import { IconArrow } from "@/components/ui/icons";
import { PageHeader } from "@/components/catalog/CatalogHeader";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Diamentory pieces as photographed in the studio and on our Instagram — rings, chains & lockets, and bracelets, with links to shop each piece.",
  alternates: { canonical: "/lookbook" },
  openGraph: { title: "Lookbook — DIAMENTORY", url: "/lookbook" },
};

/** Frames: [product slug, image index]. Real photographs only, straight from the catalogue. */
const LOOKS: [string, number][] = [
  ["cuban-link-chain", 0],
  ["onyx-square-locket", 0],
  ["textured-band-ring", 0],
  ["iced-cuban-bracelet", 1],
  ["zulfiqar-pendant", 0],
  ["textured-wrap-ring", 0],
  ["onyx-square-locket", 2],
  ["sword-wrap-ring", 0],
  ["rope-chain", 0],
];

/**
 * Magazine placement on a 12-col grid. Desktop frames span ≤ 5 columns (≈ 520px max), so the
 * 768px studio frames are never upscaled; 9:16 frames sit in narrower columns.
 */
const LAYOUT: { place: string; aspect: string; sizes: string }[] = [
  {
    place: "col-span-12 sm:col-span-7 lg:col-span-5",
    aspect: "ratio-portrait",
    sizes: "(min-width:1024px) 34vw, (min-width:640px) 58vw, 100vw",
  },
  {
    place: "col-span-8 col-start-5 sm:col-span-5 sm:col-start-8 lg:col-span-3 lg:col-start-8 lg:mt-40",
    aspect: "ratio-tall",
    sizes: "(min-width:1024px) 20vw, (min-width:640px) 40vw, 66vw",
  },
  {
    place: "col-span-7 lg:col-span-4 lg:col-start-2",
    aspect: "ratio-portrait",
    sizes: "(min-width:1024px) 27vw, 58vw",
  },
  {
    place: "col-span-5 mt-24 lg:col-span-3 lg:col-start-7 lg:mt-32",
    aspect: "ratio-tall",
    sizes: "(min-width:1024px) 20vw, 42vw",
  },
  {
    place: "col-span-10 col-start-2 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-9",
    aspect: "ratio-portrait",
    sizes: "(min-width:1024px) 27vw, (min-width:640px) 50vw, 84vw",
  },
  {
    place: "col-span-6 lg:col-span-3 lg:col-start-1",
    aspect: "ratio-tall",
    sizes: "(min-width:1024px) 20vw, 50vw",
  },
  {
    place: "col-span-6 mt-20 lg:col-span-4 lg:col-start-5 lg:mt-32",
    aspect: "ratio-portrait",
    sizes: "(min-width:1024px) 27vw, 50vw",
  },
  {
    place: "col-span-9 lg:col-span-4 lg:col-start-9 lg:mt-12",
    aspect: "ratio-square",
    sizes: "(min-width:1024px) 27vw, 75vw",
  },
  {
    place: "col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-4 lg:mt-12",
    aspect: "ratio-portrait",
    sizes: "(min-width:1024px) 34vw, (min-width:640px) 66vw, 100vw",
  },
];

export default function LookbookPage() {
  const looks = LOOKS.flatMap(([slug, i]) => {
    const product = getProduct(slug);
    const img = product?.images[i] ?? product?.images[0];
    return product && img ? [{ product, img }] : [];
  });

  return (
    <>
      <PageHeader
        eyebrow="Lookbook"
        title="Look"
        accent="book."
        intro="Diamentory pieces as photographed in the studio and on our Instagram. Every frame links to the piece it shows."
      />
      <div className="wrap pb-[var(--section-y)]">
        <ol className="grid-12 mt-4 gap-y-14 lg:mt-8 lg:gap-y-20">
          {looks.map(({ product, img }, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            const cat = getCategory(product.category);
            const href = `/product/${product.slug}${img.finish ? `?finish=${img.finish}` : ""}`;
            return (
              <li key={`${product.slug}-${i}`} className={l.place}>
                <figure>
                  <Link href={href} className="group block" tabIndex={-1} aria-hidden="true">
                    <div className={clsx("reveal-mask relative overflow-hidden bg-paper", l.aspect)}>
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes={l.sizes}
                        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                        style={{ objectPosition: img.focus ?? "50% 40%" }}
                      />
                    </div>
                  </Link>
                  <figcaption className="reveal mt-3">
                    <p className="eyebrow flex flex-wrap gap-x-3 text-stone tabular-nums">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        {cat?.shortName} — {product.subcategory}
                      </span>
                    </p>
                    <p className="mt-2 text-[0.9375rem]">{img.alt}.</p>
                    <Link
                      href={href}
                      className="mt-1 inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-semibold"
                    >
                      <span className="link-line">Shop the {product.name}</span>
                      <IconArrow size={14} />
                    </Link>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>

        <section
          aria-labelledby="lb-more"
          className="mt-[var(--section-y)] border-t border-obsidian/10 pt-10 lg:flex lg:items-end lg:justify-between"
        >
          <h2 id="lb-more" className="t-h2 reveal">
            More on <em>Instagram.</em>
          </h2>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:mt-0">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              {SITE.instagramHandle} <span className="sr-only">(opens in a new tab)</span>
            </a>
            <Link href="/collections" className="btn btn-outline">
              Explore collections
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
