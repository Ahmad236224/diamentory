import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { CATEGORIES, getProduct, type Category, type CategorySlug, type ProductImage } from "@/lib/catalog";

/* ───────────────────────────────────────────────
   Listing page headers. One layout for every listing (shop, categories,
   collections, new arrivals, search): breadcrumbs → eyebrow → .t-h1 → intro,
   with real photography on the right (desktop) / below (mobile), all on `.wrap`.
   ─────────────────────────────────────────────── */

/** A product photo reference: [product slug, image index]. Resolved from the catalogue (single source). */
export type PhotoRef = [slug: string, index: number, focus?: string];

export function resolvePhotos(refs: PhotoRef[]): (ProductImage & { href: string })[] {
  return refs.flatMap(([slug, i, focus]) => {
    const p = getProduct(slug);
    const img = p?.images[i] ?? p?.images[0];
    // optional focus override: header frames are cropped wider than the product cards
    return p && img ? [{ ...img, focus: focus ?? img.focus, href: `/product/${p.slug}` }] : [];
  });
}

/** Real photography per category. Studio frames for rings/chains; Instagram frames for bracelets (no studio shots exist). */
export const CATEGORY_PHOTOS: Record<CategorySlug, PhotoRef[]> = {
  // second frames where a piece has one, so the header doesn't repeat the first cards of the grid
  rings: [
    ["textured-band-ring", 0],
    ["sword-wrap-ring", 1],
  ],
  chains: [
    ["onyx-square-locket", 1, "50% 60%"],
    ["round-snake-chain", 1],
  ],
  bracelets: [
    ["iced-cuban-bracelet", 1],
    ["iced-link-bracelet", 0],
  ],
};

/**
 * 2–3 photos in a row. Frames never exceed ~390 CSS px wide on desktop, so 768px studio
 * shots stay sharp (no upscaling). Each frame wipes in (`.reveal-mask`) and honours `focus`.
 */
export function HeaderPhotos({
  photos,
  priority,
  linked = true,
}: {
  photos: (ProductImage & { href?: string })[];
  priority?: boolean;
  linked?: boolean;
}) {
  const cols = photos.length >= 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <ul className={clsx("grid gap-[var(--grid-gap)]", cols)}>
      {photos.map((img, i) => {
        const frame = (
          <div className="reveal-mask relative aspect-square overflow-hidden bg-paper sm:aspect-[4/5]" style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
            <Image
              src={img.src}
              alt={linked ? "" : img.alt}
              fill
              priority={priority && i === 0}
              sizes={photos.length >= 3 ? "(min-width:1024px) 13vw, 30vw" : "(min-width:1024px) 20vw, 46vw"}
              className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
              style={{ objectPosition: img.focus ?? "50% 40%" }}
            />
          </div>
        );
        return (
          <li key={img.src}>
            {linked && img.href ? (
              <Link href={img.href} className="group block" aria-label={img.alt}>
                {frame}
              </Link>
            ) : (
              frame
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Shared page header (listings, client care, cart, checkout, 404): same edge, spacing and type on every page. */
export function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
  media,
  meta,
  crumbs,
  children,
  size = "h1",
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  accent?: string;
  intro?: React.ReactNode;
  /** Photos (or other media) — right column on desktop, below the text on mobile. */
  media?: React.ReactNode;
  meta?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
  /** Extra content under the intro (e.g. the search field). */
  children?: React.ReactNode;
  /** "h2" = compact title for task pages (checkout) where the form should lead. */
  size?: "h1" | "h2";
}) {
  return (
    <header className="wrap pt-2 pb-8 lg:pt-4 lg:pb-12">
      {crumbs ? <Breadcrumbs items={crumbs} /> : <div className="h-11" aria-hidden="true" />}
      <div className="grid-12 mt-2 items-end gap-y-6 lg:mt-8">
        <div className={clsx("reveal col-span-12", media && "lg:col-span-7")}>
          <p className="eyebrow flex items-center gap-3 text-stone">{eyebrow}</p>
          <h1 className={clsx(size === "h2" ? "t-h2" : "t-h1", "mt-4 text-balance")}>
            {title}
            {accent && (
              <>
                {" "}
                <em>{accent}</em>
              </>
            )}
          </h1>
          {intro && <div className="mt-5 max-w-[46ch] text-graphite lg:mt-6">{intro}</div>}
          {children}
          {/* the filter bar shows the live count on phones; keep the header short there */}
          {meta && <p className="eyebrow mt-5 hidden text-stone tabular-nums lg:block">{meta}</p>}
        </div>
        {media && <div className="col-span-12 lg:col-span-5">{media}</div>}
      </div>
    </header>
  );
}

export function CategoryHeader({ category, count }: { category: Category; count: number }) {
  const index = CATEGORIES.findIndex((c) => c.slug === category.slug) + 1;
  return (
    <PageHeader
      crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: category.name }]}
      eyebrow={
        <>
          <span className="tag">N° {String(index).padStart(2, "0")}</span>
          {category.tagline}
        </>
      }
      title={category.name}
      intro={category.intro}
      meta={`${count} ${count === 1 ? "piece" : "pieces"}`}
      media={<HeaderPhotos photos={resolvePhotos(CATEGORY_PHOTOS[category.slug])} priority />}
    />
  );
}

/** Horizontal category switcher shared by listing pages. */
export function CategoryNav({ active }: { active?: CategorySlug | "all" | "new" }) {
  const items = [
    { href: "/shop", label: "Shop all", key: "all" },
    ...CATEGORIES.map((c) => ({ href: `/shop/${c.slug}`, label: c.shortName, key: c.slug })),
    { href: "/new-arrivals", label: "New", key: "new" },
  ];
  return (
    <nav aria-label="Shop categories">
      <ul className="wrap no-scrollbar flex gap-6 overflow-x-auto lg:gap-8">
        {items.map((it) => (
          <li key={it.key} className="shrink-0">
            <Link
              href={it.href}
              aria-current={active === it.key ? "page" : undefined}
              className={clsx(
                "eyebrow inline-flex min-h-11 items-center border-b transition-colors",
                active === it.key ? "border-obsidian text-obsidian" : "border-transparent text-stone hover:text-obsidian",
              )}
            >
              {it.label}
            </Link>
          </li>
        ))}
        <li aria-hidden="true" className="w-1 shrink-0" />
      </ul>
    </nav>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-[0.75rem] text-stone">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link href={it.href} className="link-line inline-flex min-h-11 items-center hover:text-obsidian">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center text-obsidian">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
