import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  FINISHES,
  getAllProducts,
  getCategory,
  getComplementary,
  getProduct,
  isSoldOut,
  priceRange,
  productFinishes,
  styleSlug,
  type Product,
} from "@/lib/catalog";
import { SITE } from "@/content/site";
import { Breadcrumbs } from "@/components/catalog/CatalogHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { IconPlus } from "@/components/ui/icons";

const finishName = (f: string) => FINISHES.find((x) => x.slug === f)?.name ?? f;

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
    openGraph: {
      title: `${p.name} — DIAMENTORY`,
      description,
      url: `/product/${p.slug}`,
      type: "website",
      images: p.images.slice(0, 1).map((i) => ({ url: i.src, width: i.width, height: i.height, alt: i.alt })),
    },
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
    brand: { "@type": "Brand", name: "Diamentory" },
    image: p.images.map((i) => new URL(i.src, SITE.url).toString()),
    // Sample prices/stock must not be published to search engines as real offers.
    offers: p.isFixture
      ? undefined
      : min === max
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

/** Params are awaited inside <Suspense> (Partial Prefetching): known products still prerender in full. */
export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    // min-h: the real page is always taller than one screen; a shorter skeleton lets the footer flash in (CLS)
    <div className="wrap min-h-[100svh] pt-2 pb-[var(--section-y)]" aria-hidden="true">
      <div className="h-11" />
      <div className="mt-2 grid gap-[var(--grid-gap)] lg:grid-cols-12">
        <div className="skeleton aspect-[4/5] lg:col-span-6" />
        <div className="space-y-4 pt-4 lg:col-span-5 lg:col-start-8">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: Params }) {
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
      <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-stone">
        <Link href={`/shop/${category.slug}`} className="link-line">
          {category.shortName}
        </Link>
        <span aria-hidden="true">—</span>
        <Link href={`/shop/${category.slug}?style=${styleSlug(product.subcategory)}`} className="link-line">
          {product.subcategory}
        </Link>
        {product.isNew && !soldOut && <span className="tag">New</span>}
      </p>
      <h1 className="t-h2 mt-4 text-balance">{product.name}</h1>
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
      <div className="wrap pt-2 pb-2 lg:pb-6">
        <div className="lg:hidden">
          <Breadcrumbs items={crumbs.slice(0, 3)} />
        </div>
        <div className="hidden lg:block">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>
      <ProductView product={product} header={header} details={details} />

      {complementary.length > 0 && (
        <section aria-labelledby="pairs-h" className="mt-[var(--section-y-sm)] border-t border-obsidian/10">
          <div className="wrap section-sm">
            <div className="reveal flex items-end justify-between gap-6">
              <h2 id="pairs-h" className="t-h2">
                Wear it <em>with</em>
              </h2>
              <Link href="/shop" className="eyebrow link-line inline-flex min-h-11 shrink-0 items-center">
                Shop all
              </Link>
            </div>
            <ul className="product-grid reveal-stagger mt-8 lg:mt-10">
              {complementary.map((p, i) => (
                <li key={p.slug} className={i === 3 ? "md:max-lg:hidden" : undefined}>
                  <ProductCard product={p} sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <RecentlyViewed current={product.slug} />
    </div>
  );
}
