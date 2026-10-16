import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, getCategory, queryProducts } from "@/lib/catalog";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { CategoryHeader, CategoryNav } from "@/components/catalog/CatalogHeader";
import type { SearchParams } from "@/components/catalog/listingState";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getCategory((await params).category);
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.tagline} ${c.intro}`,
    alternates: { canonical: `/shop/${c.slug}` },
    openGraph: { title: `${c.name} — DIAMENTORY`, description: c.intro, url: `/shop/${c.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const count = queryProducts({ category: category.slug }).length;
  return (
    <>
      <CategoryHeader category={category} count={count} />
      <div className="pt-6 lg:pt-16">
        <CategoryNav active={category.slug} />
      </div>
      <Suspense fallback={<ListingSkeleton />}>
        <Listing config={{ basePath: `/shop/${category.slug}`, category: category.slug }} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
