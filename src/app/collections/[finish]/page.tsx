import type { Metadata } from "next";
import { SITE } from "@/content/site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import clsx from "clsx";
import { queryProducts } from "@/lib/catalog";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { HeaderPhotos, PageHeader } from "@/components/catalog/CatalogHeader";
import { activeFinishes, finishPhotos } from "@/components/catalog/finishArt";
import type { SearchParams } from "@/components/catalog/listingState";

type Params = Promise<{ finish: string }>;

/** Only finishes with pieces get a page; any other slug (e.g. an empty "black") 404s. */
const findActive = (slug: string) => activeFinishes().find((f) => f.slug === slug);

export function generateStaticParams() {
  return activeFinishes().map((f) => ({ finish: f.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const f = findActive((await params).finish);
  if (!f) return {};
  return {
    title: `${f.name} Jewellery`,
    description: `${f.note} Rings, chains & lockets, and bracelets in the ${f.name.toLowerCase()} finish.`,
    alternates: { canonical: `/collections/${f.slug}` },
    openGraph: { images: SITE.ogImages, title: `${f.name} Collection — DIAMENTORY`, url: `/collections/${f.slug}` },
  };
}

/** Params are awaited inside <Suspense> (Partial Prefetching): known finishes still prerender in full. */
export default function FinishPage({ params, searchParams }: { params: Params; searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <FinishCollection params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function FinishCollection({ params, searchParams }: { params: Params; searchParams: Promise<SearchParams> }) {
  const finish = findActive((await params).finish);
  if (!finish) notFound();
  const count = queryProducts({ finish: [finish.slug] }).length;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/collections", label: "Collections" }, { label: finish.name }]}
        eyebrow="Collection by finish"
        title={finish.name}
        intro={
          <>
            <p className="text-obsidian">{finish.note}</p>
            <p className="mt-1">Every piece made in {finish.name.toLowerCase()}, across all three categories.</p>
          </>
        }
        meta={`${count} ${count === 1 ? "piece" : "pieces"}`}
        media={<HeaderPhotos photos={finishPhotos(finish.slug, 2)} priority />}
      />
      <nav aria-label="Other finishes">
        <ul className="wrap no-scrollbar flex gap-6 overflow-x-auto lg:gap-8">
          {activeFinishes().map((f) => (
            <li key={f.slug} className="shrink-0">
              <Link
                href={`/collections/${f.slug}`}
                aria-current={f.slug === finish.slug ? "page" : undefined}
                className={clsx(
                  "eyebrow inline-flex min-h-11 items-center border-b transition-colors",
                  f.slug === finish.slug ? "border-obsidian" : "border-transparent text-stone hover:text-obsidian",
                )}
              >
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Suspense fallback={<ListingSkeleton />}>
        <Listing
          config={{
            basePath: `/collections/${finish.slug}`,
            finish: finish.slug,
            allowCategory: true,
            allowFinish: false,
          }}
          searchParams={searchParams}
        />
      </Suspense>
    </>
  );
}
