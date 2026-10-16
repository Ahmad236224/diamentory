import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FINISHES,
  getAllProducts,
  getCategory,
  getComplementary,
  getProduct,
  isSoldOut,
  priceRange,
  productFinishes,
  type Product,
} from "@/lib/catalog";
import { SITE } from "@/content/site";
import { Breadcrumbs } from "@/components/catalog/CatalogHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
const finishName = (f: string) => FINISHES.find((x) => x.slug === f)?.name ?? f;
import { IconPlus } from "@/components/ui/icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const cat = getCategory(p.category);
  const finishes = productFinishes(p).map((f) => finishName(f).toLowerCase());
  const description = `${p.description} Available in ${finishes.join(", ")}.`;
  return {
    title: `${p.name}${cat ? ` — ${cat.shortName}` : ""}`,
    description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} — DIAMENTORY`, description, url: `/product/${p.slug}`, type: "website" },
  };
}

function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

function productSchema(p: Product) {
  const { min, max } = priceRange(p);
  const url = new URL(`/product/${p.slug}`, SITE.url).toString();
  const availability = isSoldOut(p) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    url,
    offers:
      min === max
        ? { "@type": "Offer", price: String(min), priceCurrency: "PKR", availability, url }
        : {
            "@type": "AggregateOffer",
            lowPrice: String(min),
            highPrice: String(max),
            offerCount: p.variants.length,
            priceCurrency: "PKR",
            availability,
            url,
          },
  };
}

function Accordion({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-obsidian/10" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow">{title}</span>
        <IconPlus size={16} className="transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <div className="pb-6 text-[0.875rem] leading-relaxed text-graphite">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const soldOut = isSoldOut(product);
  const complementary = getComplementary(product, 4);
  const finishes = productFinishes(product);
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const specs = [
    { k: "Materials", v: product.materials },
    { k: "Dimensions", v: product.dimensions },
    { k: "Care", v: product.care },
  ].filter((s): s is { k: string; v: string } => !!s.v);

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: `/shop/${category.slug}`, label: category.name },
    { label: product.name },
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: new URL(c.href ?? `/product/${product.slug}`, SITE.url).toString(),
    })),
  };

  const header = (
    <>
      <div className="hidden lg:block">
        <Breadcrumbs items={crumbs} />
      </div>
      <p className="eyebrow mt-1 text-stone lg:mt-6">
        {category.shortName} — {product.subcategory}
        {product.isNew && !soldOut && <span className="ml-3 text-obsidian">New</span>}
      </p>
      <h1 className="display mt-3 text-[2.75rem] text-balance sm:text-6xl xl:text-7xl">{product.name}</h1>
      {soldOut && (
        <p className="mt-5 border-l border-obsidian pl-4 text-[0.875rem] text-graphite">
          Currently sold out in every option.{" "}
          <Link href={`/shop/${category.slug}?stock=1`} className="underline underline-offset-4">
            See {category.shortName.toLowerCase()} in stock
          </Link>
        </p>
      )}
    </>
  );

  const details = (
    <div className="mt-8 border-t border-obsidian/10 pt-8">
      <p className="max-w-prose text-[0.9375rem] leading-relaxed text-graphite">{product.description}</p>
      <div className="mt-8 border-t border-obsidian/10">
        <Accordion title="Details & specifications">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="text-stone">Finishes</dt>
            <dd>{finishes.map((f) => finishName(f)).join(", ")}</dd>
            {sizes.length > 0 && (
              <>
                <dt className="text-stone">{product.sizeLabel ?? "Size"}</dt>
                <dd>{sizes.join(", ")}</dd>
              </>
            )}
            {specs.map((s) => (
              <div key={s.k} className="contents">
                <dt className="text-stone">{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
          {specs.length === 0 && (
            <p className="mt-4 text-[0.8125rem] text-stone">
              Specifications to be confirmed — materials, dimensions and care details will be added once verified.
            </p>
          )}
        </Accordion>
        <Accordion title="Shipping & returns">
          <p>
            Delivery fees, timings and the returns window are being finalised and will be shown at checkout.
            For the latest details see{" "}
            <Link href="/shipping" className="underline underline-offset-4">
              Shipping
            </Link>{" "}
            and{" "}
            <Link href="/returns" className="underline underline-offset-4">
              Returns &amp; exchanges
            </Link>
            .
          </p>
        </Accordion>
      </div>
    </div>
  );

  return (
    <div className="pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema(product))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbLd)} />
      <div className="gutter mx-auto max-w-[1800px] lg:hidden">
        <Breadcrumbs items={crumbs.slice(0, 3)} />
      </div>
      <div className="lg:pt-8">
        <ProductView product={product} header={header} details={details} />
      </div>

      {complementary.length > 0 && (
        <section aria-labelledby="pairs-h" className="gutter mx-auto mt-20 max-w-[1800px] border-t border-obsidian/10 py-16 lg:mt-32 lg:py-24">
          <div className="flex items-end justify-between gap-6">
            <h2 id="pairs-h" className="display text-4xl lg:text-6xl">
              Wear it <em className="italic">with</em>
            </h2>
            <Link href="/shop" className="eyebrow link-line inline-flex min-h-11 shrink-0 items-center">
              Shop all
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4 lg:gap-6">
            {complementary.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width:1024px) 22vw, 48vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
      <RecentlyViewed current={product.slug} />
    </div>
  );
}
