import type { Metadata } from "next";
import Link from "next/link";
import { queryProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { HeaderPhotos, PageHeader } from "@/components/catalog/CatalogHeader";
import { activeFinishes, finishPhotos } from "@/components/catalog/finishArt";
import { IconArrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Collections by Finish",
  description: "Shop Diamentory by finish — rings, chains & lockets, and bracelets in gold, silver and two-tone.",
  alternates: { canonical: "/collections" },
  openGraph: { title: "Collections — DIAMENTORY", url: "/collections" },
};

const WORDS = ["One", "Two", "Three", "Four"];

export default function CollectionsPage() {
  const finishes = activeFinishes();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Collections" }]}
        eyebrow="Collections"
        title={WORDS[finishes.length - 1] ?? String(finishes.length)}
        accent="finishes"
        intro="Choose the tone that suits your skin, your wardrobe and the rest of your stack — then find every piece made in it."
        media={<HeaderPhotos photos={finishes.flatMap((f) => finishPhotos(f.slug, 1))} priority />}
      />
      <div>
        {finishes.map((f, i) => {
          const products = queryProducts({ finish: [f.slug] });
          const href = `/collections/${f.slug}`;
          return (
            <section key={f.slug} aria-labelledby={`fin-${f.slug}`} className="border-t border-obsidian/10">
              <div className="wrap section-sm">
                <div className="reveal flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                  <div>
                    <p className="eyebrow flex items-center gap-3 text-stone tabular-nums">
                      <span className="tag">N° {String(i + 1).padStart(2, "0")}</span>
                      {products.length} {products.length === 1 ? "piece" : "pieces"}
                    </p>
                    <h2 id={`fin-${f.slug}`} className="t-h2 mt-4">
                      <Link href={href}>{f.name}</Link>
                    </h2>
                    <p className="mt-3 text-graphite">{f.note}</p>
                  </div>
                  <Link href={href} className="btn btn-outline">
                    Shop all {f.name.toLowerCase()} <IconArrow size={16} />
                  </Link>
                </div>
                <ul className="product-grid reveal-stagger mt-8 lg:mt-10">
                  {products.slice(0, 4).map((p, j) => (
                    <li key={p.slug} className={j === 3 ? "md:max-lg:hidden" : undefined}>
                      <ProductCard product={p} finish={f.slug} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
