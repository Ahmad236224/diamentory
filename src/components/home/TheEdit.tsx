import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { IconArrow } from "@/components/ui/icons";
import { CATEGORIES, queryProducts } from "@/lib/catalog";
import { EditTabs } from "./EditTabs";
import { SectionHead } from "./SectionHead";

/** 04 — The edit. The page's one product grid: three pieces per category + a "view all" tile, quick add on every card. */
export function TheEdit() {
  return (
    <section aria-labelledby="edit-title" className="section bg-ivory">
      <div className="wrap">
        <SectionHead n="04" label="Shop" href="/shop" cta="Shop all" />
        <h2 id="edit-title" className="t-h2 reveal mt-8 lg:mt-12">
          The edit.
        </h2>
        <div className="reveal mt-8" style={{ "--d": "100ms" } as React.CSSProperties}>
          <EditTabs labels={CATEGORIES.map((c) => c.name)}>
            {CATEGORIES.map((c) => (
              <ul key={c.slug} className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-8 lg:grid-cols-4">
                {queryProducts({ category: c.slug, inStock: true })
                  .slice(0, 3)
                  .map((p) => (
                    <li key={p.slug}>
                      <ProductCard product={p} sizes="(min-width:1024px) 22vw, 45vw" />
                    </li>
                  ))}
                <li>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="group ratio-card flex flex-col justify-between bg-obsidian p-5 text-ivory transition-colors hover:bg-graphite lg:p-6"
                  >
                    <span className="eyebrow text-champagne">View all</span>
                    <span className="link-arrow flex items-end justify-between gap-3">
                      <span className="t-h3">{c.name}</span>
                      <IconArrow size={20} className="shrink-0" />
                    </span>
                  </Link>
                </li>
              </ul>
            ))}
          </EditTabs>
        </div>
      </div>
    </section>
  );
}
