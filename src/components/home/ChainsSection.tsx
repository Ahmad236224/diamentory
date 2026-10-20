import { getAllProducts, getCategory, styleSlug, stylesOf } from "@/lib/catalog";
import { SectionHead } from "./SectionHead";
import { ChainExplorer, type ChainStyle } from "./ChainExplorer";

/**
 * 02 — Chain & Lockets. An interactive index: every chain style maps to a real product and its
 * studio photograph (newest piece of that style first). Styles without a photographed product are
 * left out rather than shown with a placeholder.
 */
export function ChainsSection() {
  const cat = getCategory("chains")!;
  const products = getAllProducts().filter((p) => p.category === "chains");

  const styles: ChainStyle[] = stylesOf(products).flatMap((s) => {
    const inStyle = products.filter((p) => p.subcategory === s);
    const lead = inStyle.find((p) => p.isNew && p.images.length) ?? inStyle.find((p) => p.images.length);
    const img = lead?.images[0];
    if (!lead || !img) return [];
    return [
      {
        label: s,
        count: inStyle.length,
        href: `/shop/chains?style=${styleSlug(s)}`,
        product: { name: lead.name, href: `/product/${lead.slug}${img.finish ? `?finish=${img.finish}` : ""}` },
        image: { src: img.src, alt: img.alt, focus: img.focus ?? "50% 35%" },
      },
    ];
  });

  return (
    <section aria-labelledby="chains-title" className="section bg-ivory">
      <div className="wrap">
        <SectionHead n="02" label={cat.name} href="/shop/chains" cta="Shop all" />
        <ChainExplorer styles={styles} />
      </div>
    </section>
  );
}
