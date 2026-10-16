import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";

/**
 * 01 — Signature hero.
 * Low-key portrait bleeds into the black field; the headline breaks across its dark edge.
 * A genuine Diamentory piece sits as the inset "N° 01".
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-obsidian text-ivory">
      <div className="relative lg:h-[calc(100svh-var(--header-h)-2rem)] lg:min-h-[620px] lg:max-h-[960px]">
        {/* Portrait — full-bleed on mobile, right 64% on desktop */}
        <div className="clip-in relative aspect-[4/5] max-h-[74svh] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:max-h-none lg:w-[64%]">
          <Photo
            id="editorial-bw-chain-shadow-portrait"
            sizes="(min-width:1024px) 64vw, 100vw"
            priority
            position="60% 82%"
            className="absolute inset-0"
            alt="Low-key black-and-white portrait of a man in profile wearing a silver chain"
          />
          {/* fade the portrait into the black field on desktop */}
          <div aria-hidden className="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-obsidian to-transparent lg:block" />
        </div>

        {/* Headline */}
        <h1
          id="hero-title"
          className="display absolute top-5 left-[var(--gutter)] z-10 text-[11.2vw] leading-[0.84] tracking-[-0.045em] lg:top-[11%] lg:text-[7.6vw]"
        >
          <span className="mask-line"><span>Not made</span></span>
          <span className="mask-line"><span style={{ animationDelay: "0.12s" }}>to blend</span></span>
          <span className="mask-line"><span style={{ animationDelay: "0.24s" }}>in.</span></span>
        </h1>

        {/* Mobile-only lower band / desktop overlay content */}
        <div className="relative z-10 gutter pt-6 pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:items-end lg:justify-between lg:pb-10">
          <div className="fade-in [animation-delay:0.5s] lg:max-w-[34rem]">
            <p className="max-w-[30rem] text-[0.95rem] leading-relaxed text-ivory/75">
              Statement chains, bracelets, rings and pendants — made to be noticed. Shipping all over Pakistan.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex">
              <Link
                href="/shop"
                className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-ivory px-6 text-obsidian transition-colors hover:bg-accent hover:text-ivory"
              >
                Shop all <IconArrow size={16} />
              </Link>
              <Link
                href="/new-arrivals"
                className="eyebrow inline-flex min-h-12 items-center justify-center border border-ivory/60 px-6 transition-colors hover:border-ivory hover:bg-ivory hover:text-obsidian"
              >
                New in
              </Link>
            </div>
          </div>

          {/* N° 01 — genuine Diamentory piece */}
          <Link
            href="/shop/bracelets"
            className="group fade-in mt-8 flex items-end gap-4 [animation-delay:0.8s] lg:mt-0"
          >
            <Photo
              id="brand-iced-cuban-bracelet-fist"
              mono
              sizes="(min-width:1024px) 9rem, 6.5rem"
              position="50% 45%"
              className="aspect-[3/4] w-[6.5rem] shrink-0 ring-1 ring-ivory/15 lg:w-36"
              alt="Diamentory iced Cuban bracelet worn on a raised fist"
            />
            <span className="pb-1">
              <span className="tag">N° 01</span>
              <span className="mt-2 block text-sm font-semibold">Iced Cuban bracelet</span>
              <span className="mt-1 flex items-center gap-2 text-xs text-ivory/60 transition-colors group-hover:text-ivory">
                Shop bracelets <IconArrow size={14} />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
