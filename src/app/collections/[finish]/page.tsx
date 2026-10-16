import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import clsx from "clsx";
import { FINISHES, getFinish, queryProducts } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";
import { Listing, ListingSkeleton } from "@/components/catalog/Listing";
import { Breadcrumbs, PageHeader } from "@/components/catalog/CatalogHeader";
import { FINISH_ART } from "@/components/catalog/finishArt";
import type { SearchParams } from "@/components/catalog/listingState";

type Params = Promise<{ finish: string }>;

export function generateStaticParams() {
  return FINISHES.map((f) => ({ finish: f.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const f = getFinish((await params).finish);
  if (!f) return {};
  return {
    title: `${f.name} Jewellery`,
    description: `${f.note} Chains, bracelets, rings and pendants in the ${f.name.toLowerCase()} finish.`,
    alternates: { canonical: `/collections/${f.slug}` },
    openGraph: { title: `${f.name} Collection — DIAMENTORY`, url: `/collections/${f.slug}` },
  };
}

export default async function FinishPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  const finish = getFinish((await params).finish);
  if (!finish) notFound();
  const art = FINISH_ART[finish.slug];
  const count = queryProducts({ finish: [finish.slug] }).length;
  return (
    <>
      <div className="gutter mx-auto max-w-[1800px] pt-2">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { href: "/collections", label: "Collections" }, { label: finish.name }]}
        />
      </div>
      <PageHeader
        eyebrow="Collection by finish"
        title={finish.name}
        accent="finish"
        art={
          <div className="clip-in relative mb-6 aspect-[16/10] overflow-hidden">
            <JewelArt
              form={art.form}
              finish={finish.slug}
              tone={art.tone}
              crop={art.crop}
              rotate={art.rotate}
              className="parallax-img absolute inset-0"
            />
          </div>
        }
        intro={
          <>
            <p className="font-serif text-xl italic text-obsidian">{finish.note}</p>
            <p className="mt-2">Every piece made in {finish.name.toLowerCase()}, across all categories.</p>
          </>
        }
        meta={`${count} pieces`}
      />
      <nav aria-label="Other finishes" className="mx-auto max-w-[1800px]">
        <ul className="no-scrollbar gutter flex gap-6 overflow-x-auto lg:gap-8">
          {FINISHES.map((f) => (
            <li key={f.slug} className="shrink-0">
              <Link
                href={`/collections/${f.slug}`}
                aria-current={f.slug === finish.slug ? "page" : undefined}
                className={clsx(
                  "eyebrow inline-flex min-h-11 items-center border-b",
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
