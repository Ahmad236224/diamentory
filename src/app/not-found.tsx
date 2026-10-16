import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getProduct } from "@/lib/catalog";
import { IconArrow, IconSearch } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for could not be found.",
  robots: { index: false },
};

/** A real studio frame (768px wide, shown ≤ ~420px). */
const PHOTO = getProduct("brushed-band-ring")?.images[0];

export default function NotFound() {
  return (
    <div className="wrap pt-2 pb-[var(--section-y)]">
      <div className="h-11" aria-hidden="true" />
      <div className="grid-12 mt-4 items-end gap-y-10 lg:mt-8">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow text-stone">Error 404</p>
          <p aria-hidden="true" className="t-hero mt-4">
            4<em>0</em>4
          </p>
          <h1 className="t-h2 mt-6">
            This piece is <em>missing.</em>
          </h1>
          <p className="mt-5 max-w-[40ch] text-graphite">
            The page you&rsquo;re looking for has moved, sold through, or never existed. Try a search, or begin again
            with a category.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <form action="/search" role="search" className="flex min-h-12 flex-1 border border-obsidian sm:max-w-sm">
              <label htmlFor="nf-q" className="sr-only">
                Search Diamentory
              </label>
              <input
                id="nf-q"
                name="q"
                type="search"
                placeholder="Search pieces"
                className="min-w-0 flex-1 bg-transparent px-4 text-base placeholder:text-stone focus:outline-none"
              />
              <button type="submit" className="grid w-12 place-items-center bg-obsidian text-ivory" aria-label="Search">
                <IconSearch size={18} />
              </button>
            </form>
            <Link href="/" className="btn btn-outline">
              Home <IconArrow size={16} />
            </Link>
          </div>
        </div>
        {PHOTO && (
          <div className="reveal-mask relative col-span-12 hidden ratio-portrait overflow-hidden bg-paper lg:col-span-4 lg:col-start-9 lg:block">
            <Image
              src={PHOTO.src}
              alt=""
              fill
              sizes="30vw"
              className="object-cover"
              style={{ objectPosition: PHOTO.focus ?? "50% 45%" }}
            />
          </div>
        )}
      </div>

      <nav aria-label="Shop by category" className="mt-16 lg:mt-24">
        <p className="eyebrow text-stone">Shop by category</p>
        <ul className="mt-4 grid border-t border-obsidian/10 sm:grid-cols-3 sm:gap-x-[var(--grid-gap)] sm:border-t-0">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="border-b border-obsidian/10 sm:border-t sm:border-b-0">
              <Link href={`/shop/${c.slug}`} className="group flex min-h-16 items-center justify-between gap-3 lg:min-h-24 lg:items-end lg:pb-1">
                <span className="t-h3">{c.shortName}</span>
                <IconArrow size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
