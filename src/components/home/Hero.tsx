import Link from "next/link";
import { JewelArt } from "@/components/art/JewelArt";

/**
 * 01 — Cinematic hero.
 * Mobile: dark macro study fills the upper frame with the headline set inside it;
 * supporting line and both CTAs always sit within the first viewport.
 * Desktop: asymmetric split — oversized headline left, tall macro right, a small
 * detail study overlapping the seam.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div
        className={[
          "mx-auto grid max-w-[1800px]",
          // mobile: image (with headline) on top, copy below — fits one viewport
          "h-[calc(100svh-var(--header-h)-2.25rem)] min-h-[420px] max-h-[980px] grid-rows-[minmax(0,1fr)_auto]",
          // desktop: 12-col asymmetric split
          "lg:min-h-[640px] lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-6 lg:pl-[var(--gutter)]",
        ].join(" ")}
      >
        {/* Primary macro study */}
        <div className="clip-in relative col-start-1 row-start-1 ml-[var(--gutter)] overflow-hidden bg-[#121110] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:ml-0">
          <JewelArt
            form="cuban-chain"
            finish="gold"
            tone="dark"
            crop={[250, 600, 520, 650]}
            rotate={-8}
            title="Study of a gold Cuban link chain on black"
            className="absolute inset-0 scale-[1.02]"
          />
          <p className="eyebrow fade-in absolute top-4 right-4 hidden text-[0.625rem] text-champagne/80 [animation-delay:1.1s] lg:top-6 lg:block lg:right-6">
            Study Nº 01
          </p>
          <p className="eyebrow fade-in absolute bottom-6 right-6 hidden text-[0.625rem] text-champagne/80 [animation-delay:1.3s] lg:block">
            Cuban link — gold
          </p>
        </div>

        {/* Headline: inside the image on mobile, left column on desktop */}
        <h1
          id="hero-title"
          className={[
            "display relative z-10 col-start-1 row-start-1 self-end pb-5 pl-[calc(var(--gutter)+1rem)] pr-4 uppercase text-ivory",
            "text-[clamp(2.4rem,12.2vw,4.6rem)] leading-[0.9]",
            "lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:pb-8 lg:pl-0 lg:pr-0 lg:text-obsidian",
            "lg:text-[clamp(5rem,8.1vw,9.5rem)]",
          ].join(" ")}
        >
          <span className="mask-line">
            <span className="[animation-delay:0.25s]">
              Wear <em className="font-serif lowercase italic">your</em>
            </span>
          </span>
          <span className="mask-line">
            <span className="[animation-delay:0.4s]">Distinction.</span>
          </span>
        </h1>

        {/* Desktop-only detail study, overlapping the seam */}
        <div
          aria-hidden="true"
          className="clip-in relative hidden overflow-hidden bg-[#121110] [animation-delay:0.35s] lg:col-span-2 lg:col-start-6 lg:row-start-1 lg:mt-10 lg:aspect-[3/4] lg:h-[min(24vh,260px)] lg:self-start lg:justify-self-end [@media(min-width:1024px)_and_(min-height:820px)]:block"
        >
          <JewelArt form="pendant-cross" finish="gold" tone="dark" crop={[290, 650, 420, 560]} rotate={-6} className="absolute inset-0" />
        </div>

        {/* Desktop-only top-left index */}
        <div className="fade-in hidden [animation-delay:0.8s] lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:block lg:self-start lg:pt-10">
          <p className="eyebrow text-stone">Chains · Bracelets · Rings · Pendants</p>
        </div>

        {/* Copy + CTAs */}
        <div className="fade-in col-start-1 row-start-2 px-[var(--gutter)] pt-5 pb-6 [animation-delay:0.6s] lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:px-0 lg:pt-0 lg:pb-12">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
            <p className="max-w-[30ch] text-[0.95rem] leading-snug text-graphite lg:text-[1.05rem]">
              Statement pieces for those who define their own style.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-7 lg:flex lg:gap-3">
            <Link
              href="/collections"
              className="eyebrow inline-flex min-h-12 items-center justify-center bg-obsidian px-5 text-ivory transition-colors hover:bg-graphite lg:px-8"
            >
              Explore Collections
            </Link>
            <Link
              href="/new-arrivals"
              className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-5 transition-colors hover:bg-obsidian hover:text-ivory lg:px-8"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
