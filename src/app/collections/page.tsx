import type { Metadata } from "next";
import Link from "next/link";
import { FINISHES, queryProducts } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryNav, PageHeader } from "@/components/catalog/CatalogHeader";
import { FINISH_ART } from "@/components/catalog/finishArt";
import { IconArrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Collections by Finish",
  description: "Shop Diamentory by finish — gold, silver, black and two-tone chains, bracelets, rings and pendants.",
  alternates: { canonical: "/collections" },
  openGraph: { title: "Collections — DIAMENTORY", url: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Four"
        accent="finishes"
        intro="One line, four tones. Choose the finish that suits your skin, your wardrobe and the rest of your stack — then find every piece made in it."
      />
      <CategoryNav />
      <div className="mt-2 border-t border-obsidian/10">
        {FINISHES.map((f, i) => {
          const products = queryProducts({ finish: [f.slug] });
          const art = FINISH_ART[f.slug];
          const href = `/collections/${f.slug}`;
          return (
            <section
              key={f.slug}
              aria-labelledby={`fin-${f.slug}`}
              className="gutter mx-auto max-w-[1800px] border-b border-obsidian/10 py-12 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:py-20"
            >
              <div className="lg:col-span-4">
                <Link href={href} className="group block" tabIndex={-1} aria-hidden="true">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <JewelArt
                      form={art.form}
                      finish={f.slug}
                      tone={art.tone}
                      crop={art.crop}
                      rotate={art.rotate}
                      className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
                <p className="eyebrow mt-6 text-stone tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {products.length} pieces
                </p>
                <h2 id={`fin-${f.slug}`} className="display mt-3 text-5xl lg:text-6xl">
                  <Link href={href}>{f.name}</Link>
                </h2>
                <p className="mt-3 font-serif text-lg italic text-graphite">{f.note}</p>
                <Link href={href} className="eyebrow mt-5 inline-flex min-h-12 items-center gap-3 border-b border-obsidian">
                  Shop all {f.name.toLowerCase()} <IconArrow size={16} />
                </Link>
              </div>
              <ul className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] lg:col-span-8 lg:mx-0 lg:mt-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
                {products.slice(0, 4).map((p) => (
                  <li key={p.slug} className="w-[44vw] shrink-0 snap-start sm:w-[30vw] lg:w-auto">
                    <ProductCard product={p} finish={f.slug} sizes="(min-width:1024px) 16vw, 44vw" />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
