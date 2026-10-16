import Link from "next/link";
import clsx from "clsx";
import { CATEGORIES, type ArtForm, type Category, type CategorySlug, type Finish } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";

type Crop = [number, number, number, number];
type Shot = { form?: ArtForm; finish: Finish; tone: "ivory" | "stone" | "dark"; crop: Crop; rotate?: number };

/** Art direction per category: a hero macro study and a smaller counter-study. */
const DIRECTION: Record<CategorySlug, { hero: Shot; inset: Shot; flip?: boolean }> = {
  chains: {
    hero: { finish: "gold", tone: "dark", crop: [120, 360, 760, 560], rotate: -8 },
    inset: { finish: "silver", tone: "ivory", crop: [60, 120, 880, 1100] },
  },
  bracelets: {
    hero: { finish: "silver", tone: "stone", crop: [80, 240, 840, 620], rotate: 10 },
    inset: { finish: "black", tone: "dark", crop: [140, 280, 720, 900] },
    flip: true,
  },
  rings: {
    hero: { finish: "black", tone: "ivory", crop: [0, 120, 1000, 800], rotate: -6 },
    inset: { form: "stone-ring", finish: "gold", tone: "dark", crop: [140, 160, 720, 900] },
  },
  pendants: {
    hero: { finish: "gold", tone: "dark", crop: [220, 360, 560, 410], rotate: 4 },
    inset: { form: "pendant-disc", finish: "silver", tone: "stone", crop: [160, 420, 680, 850] },
    flip: true,
  },
  sets: {
    hero: { finish: "two-tone", tone: "stone", crop: [40, 160, 920, 680], rotate: -4 },
    inset: { form: "tennis-bracelet", finish: "gold", tone: "dark", crop: [100, 260, 800, 1000] },
  },
};

export function CategoryHeader({ category, count }: { category: Category; count: number }) {
  const d = DIRECTION[category.slug];
  const index = CATEGORIES.findIndex((c) => c.slug === category.slug) + 1;
  const [first, ...rest] = category.name.split(" ");
  return (
    <header className="mx-auto max-w-[1800px] lg:gutter lg:pt-10">
      <div className={clsx("lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10", d.flip && "lg:[&>*:first-child]:order-2")}>
        <div className="relative lg:col-span-7">
          <div className="clip-in relative aspect-[5/4] overflow-hidden lg:aspect-[16/11]">
            <JewelArt
              form={d.hero.form ?? category.art}
              finish={d.hero.finish}
              tone={d.hero.tone}
              crop={d.hero.crop}
              rotate={d.hero.rotate}
              className="parallax-img absolute inset-0"
            />
            <p
              className={clsx(
                "eyebrow absolute bottom-4 left-4 lg:bottom-6 lg:left-6",
                d.hero.tone === "dark" ? "text-champagne" : "bg-ivory/85 px-2 py-1 text-graphite",
              )}
              aria-hidden="true"
            >
              {String(index).padStart(2, "0")} — {category.shortName}
            </p>
          </div>
          <div
            className={clsx(
              "absolute -bottom-10 hidden aspect-[4/5] w-[22%] overflow-hidden ring-8 ring-ivory sm:block lg:-bottom-12",
              d.flip ? "left-6 lg:-left-6" : "right-6 lg:-right-6",
            )}
          >
            <JewelArt
              form={d.inset.form ?? category.art}
              finish={d.inset.finish}
              tone={d.inset.tone}
              crop={d.inset.crop}
              rotate={d.inset.rotate}
              className="absolute inset-0"
            />
          </div>
        </div>
        <div className="gutter pt-8 pb-10 sm:pt-16 lg:col-span-5 lg:px-0 lg:pt-0 lg:pb-2">
          <p className="eyebrow text-stone">
            Collection {String(index).padStart(2, "0")} / {String(CATEGORIES.length).padStart(2, "0")}
          </p>
          <h1 className="display mt-4 text-[3.25rem] sm:text-7xl xl:text-8xl">
            {first}
            {rest.length > 0 && (
              <>
                {" "}
                <em className="italic">{rest.join(" ")}</em>
              </>
            )}
          </h1>
          <p className="mt-6 font-serif text-xl italic text-graphite lg:text-2xl">{category.tagline}</p>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-graphite">{category.intro}</p>
          <p className="eyebrow mt-6 text-stone tabular-nums">
            {count} {count === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
  art,
  meta,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: React.ReactNode;
  art?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <header className="gutter mx-auto max-w-[1800px] pt-10 pb-10 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:pt-16 lg:pb-14">
      <div className="lg:col-span-7">
        <p className="eyebrow text-stone">{eyebrow}</p>
        <h1 className="display mt-4 text-[3.25rem] sm:text-7xl xl:text-[7.5rem]">
          {title}
          {accent && (
            <>
              {" "}
              <em className="italic">{accent}</em>
            </>
          )}
        </h1>
      </div>
      <div className="mt-6 lg:col-span-5 lg:mt-0">
        {art}
        {intro && <div className="max-w-md text-[0.9375rem] leading-relaxed text-graphite">{intro}</div>}
        {meta && <div className="eyebrow mt-5 text-stone tabular-nums">{meta}</div>}
      </div>
    </header>
  );
}

/** Horizontal category switcher shared by listing pages. */
export function CategoryNav({ active }: { active?: CategorySlug | "all" | "new" }) {
  const items = [
    { href: "/shop", label: "Shop all", key: "all" },
    { href: "/new-arrivals", label: "New", key: "new" },
    ...CATEGORIES.map((c) => ({ href: `/shop/${c.slug}`, label: c.shortName, key: c.slug })),
  ];
  return (
    <nav aria-label="Shop categories" className="mx-auto max-w-[1800px]">
      <ul className="no-scrollbar gutter flex gap-6 overflow-x-auto lg:gap-8">
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
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-stone">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? (
              <Link href={it.href} className="link-line inline-flex min-h-11 items-center hover:text-obsidian">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-obsidian">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
