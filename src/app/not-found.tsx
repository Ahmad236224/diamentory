import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";
import { IconArrow, IconSearch } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for could not be found.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="gutter mx-auto max-w-[1800px] pt-10 pb-20 sm:pt-14 lg:pt-20 lg:pb-28">
      <div className="grid items-end gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <p className="eyebrow text-stone">Error 404</p>
          <p aria-hidden="true" className="display mt-4 text-[clamp(8.5rem,46vw,22rem)] leading-[0.8] tracking-[-0.04em]">
            4<em>0</em>4
          </p>
          <h1 className="display mt-8 text-[clamp(2rem,7vw,3.75rem)]">
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
            <Link href="/" className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 border border-obsidian px-6">
              Home <IconArrow size={16} />
            </Link>
          </div>
        </div>
        <div className="relative hidden aspect-[4/5] overflow-hidden lg:col-span-4 lg:col-start-9 lg:block">
          <JewelArt form="signet-ring" finish="gold" tone="dark" view={3} crop={[260, 220, 480, 600]} className="absolute inset-0" />
        </div>
      </div>

      <nav aria-label="Shop by category" className="mt-16 lg:mt-24">
        <p className="eyebrow text-stone">Shop by category</p>
        <ul className="mt-4 grid border-t border-obsidian/10 sm:grid-cols-2 lg:grid-cols-5 lg:border-t-0">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="border-b border-obsidian/10 lg:border-t lg:border-b-0 lg:pr-6">
              <Link href={`/shop/${c.slug}`} className="group flex min-h-16 items-center justify-between gap-3 lg:min-h-24 lg:items-end lg:pb-1">
                <span className="font-serif text-2xl lg:text-[1.75rem]">{c.shortName}</span>
                <IconArrow size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
