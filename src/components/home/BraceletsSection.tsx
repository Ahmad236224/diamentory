import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { getAllProducts, getCategory, styleSlug, stylesOf } from "@/lib/catalog";
import { FrameCaption, SectionHead } from "./SectionHead";

/**
 * No studio bracelet photography exists: these are the brand's own Instagram frames (720–1080 px wide),
 * so they stay within their native width — four 9:16 frames across the full row, stepped like a contact sheet.
 */
const FRAMES = [
  { id: "brand-iced-cuban-bracelet-wrist", href: "/product/iced-cuban-bracelet", name: "Iced Cuban Bracelet", focus: "50% 45%" },
  { id: "brand-cuban-bracelets-hand", href: "/product/cuban-link-bracelet", name: "Cuban Link Bracelet", focus: "50% 50%" },
  { id: "brand-iced-link-bracelets-wrist", href: "/product/iced-link-bracelet", name: "Iced Link Bracelet", focus: "50% 50%" },
  { id: "brand-iced-cuban-bracelet-fist", href: "/product/iced-cuban-bracelet", name: "Iced Cuban, worn", focus: "50% 40%" },
];

/** 03 — Bracelets. Black chapter: title row, then the frames across the full width. */
export function BraceletsSection() {
  const cat = getCategory("bracelets")!;
  const styles = stylesOf(getAllProducts().filter((p) => p.category === "bracelets"));
  return (
    <section aria-labelledby="bracelets-title" className="section bg-obsidian text-ivory">
      <div className="wrap">
        <SectionHead n="03" label={cat.name} href="/shop/bracelets" cta="Shop bracelets" tone="dark" />

        <div className="mt-8 grid gap-y-6 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-x-[var(--grid-gap)]">
          <h2 id="bracelets-title" className="t-h2 reveal lg:col-span-6">
            Weight at
            <br />
            <em>the wrist.</em>
          </h2>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="reveal max-w-[26rem] text-pretty text-champagne" style={{ "--d": "100ms" } as React.CSSProperties}>
              Cuban link and iced bracelets, worn alone or stacked.
            </p>
            <ul className="reveal mt-6 flex flex-wrap gap-2" style={{ "--d": "180ms" } as React.CSSProperties}>
              {styles.map((s) => (
                <li key={s}>
                  <Link
                    href={`/shop/bracelets?style=${styleSlug(s)}`}
                    className="inline-flex min-h-11 items-center border border-ivory/25 px-4 text-sm transition-colors hover:border-ivory hover:bg-ivory hover:text-obsidian"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="reveal-stagger mt-10 grid grid-cols-2 items-start gap-[var(--grid-gap)] sm:grid-cols-4 lg:mt-16">
          {FRAMES.map((f) => (
            <li key={f.id} className="even:mt-10 lg:even:mt-16">
              <Link href={f.href} className="group block">
                <div className="ratio-tall relative overflow-hidden">
                  <div className="frame-zoom absolute inset-0">
                    <Photo
                      id={f.id}
                      dark
                      sizes="(min-width:1024px) 22vw, (min-width:640px) 24vw, 46vw"
                      position={f.focus}
                      className="absolute inset-0"
                    />
                  </div>
                </div>
                <FrameCaption name={f.name} tone="dark" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
