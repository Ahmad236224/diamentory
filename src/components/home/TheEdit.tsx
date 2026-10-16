import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { IconArrow } from "@/components/ui/icons";
import { CATEGORIES, queryProducts } from "@/lib/catalog";
import { EditTabs } from "./EditTabs";
import { SectionRule } from "./SectionRule";

const TABS = [
  { label: "Signature", href: "/shop", list: () => queryProducts({ sort: "featured", inStock: true }).filter((p) => p.isFeatured) },
  ...CATEGORIES.filter((c) => c.slug !== "sets").map((c) => ({
    label: c.shortName,
    href: `/shop/${c.slug}`,
    list: () => queryProducts({ category: c.slug, inStock: true }),
  })),
];

/** 08 — The edit. A compact working shop: tabs, real catalogue data, quick add. */
export function TheEdit() {
  return (
    <section aria-labelledby="edit-title" className="bg-ivory py-14 text-obsidian lg:py-24">
      <div className="gutter mx-auto max-w-[1800px]">
        <SectionRule n="08" label="The edit" aside="Shop now" />
        <h2 id="edit-title" className="reveal display mt-8 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.84]">
          The edit.
        </h2>
        <div className="mt-8">
          <EditTabs labels={TABS.map((t) => t.label)}>
            {TABS.map((t) => (
              <div key={t.label}>
                <ul className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
                  {t.list().slice(0, 4).map((p) => (
                    <li key={p.slug} className="w-[64vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto">
                      <ProductCard product={p} sizes="(min-width:1024px) 22vw, 64vw" />
                    </li>
                  ))}
                </ul>
                <Link href={t.href} className="eyebrow link-line mt-6 inline-flex min-h-11 items-center gap-2">
                  View all {t.label === "Signature" ? "pieces" : t.label.toLowerCase()} <IconArrow size={14} />
                </Link>
              </div>
            ))}
          </EditTabs>
        </div>
      </div>
    </section>
  );
}
