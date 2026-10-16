import { getAllProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHead } from "./SectionHead";

/** 03 — Signature selection: catalogue items flagged `isFeatured`. */
export function SignatureSelection() {
  const featured = getAllProducts().filter((p) => p.isFeatured);
  if (!featured.length) return null;
  const [lead, ...rest] = featured;

  return (
    <section aria-labelledby="sig-title" className="mx-auto max-w-[1800px] pb-24 lg:pb-40">
      <SectionHead
        index="03"
        eyebrow="Signature selection"
        id="sig-title"
        className="gutter"
        title={
          <>
            The <em className="italic">signatures.</em>
          </>
        }
        link={{ href: "/collections", label: "View collections" }}
      />

      <div className="mt-10 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pl-[var(--gutter)]">
        {/* lead piece, given room */}
        <div className="px-[var(--gutter)] lg:col-span-5 lg:px-0">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <ProductCard product={lead} aspect="aspect-[4/5]" sizes="(min-width:1024px) 40vw, 92vw" />
            <p className="mt-5 max-w-[42ch] text-[0.85rem] leading-relaxed text-graphite">{lead.description}</p>
          </div>
        </div>

        {/* the rest: snap rail on mobile, offset grid on desktop */}
        <ul
          aria-label="More from the signature selection"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-[var(--gutter)] px-[var(--gutter)] lg:col-span-7 lg:mt-0 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14 lg:overflow-visible lg:pl-0"
        >
          {rest.map((p, i) => (
            <li key={p.slug} className={`w-[62vw] max-w-[300px] shrink-0 snap-start lg:w-auto lg:max-w-none ${i % 3 === 1 ? "lg:mt-20" : ""}`}>
              <ProductCard product={p} sizes="(min-width:1024px) 20vw, 62vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
