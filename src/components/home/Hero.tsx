import Link from "next/link";
import clsx from "clsx";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";

/** Studio frames are 768 px wide: one full-bleed portrait on phones, a native 9:16 triptych from md up. */
const FRAMES = [
  { id: "product-chain-cuban-silver", href: "/product/cuban-link-chain", name: "Cuban Link Chain", focus: "50% 30%" },
  { id: "product-locket-onyx-gold-snake", href: "/product/onyx-square-locket?finish=gold", name: "Onyx Square Locket", focus: "50% 42%" },
  { id: "product-ring-textured-band-gold", href: "/product/textured-band-ring", name: "Textured Band Ring", focus: "55% 48%" },
];

/**
 * 00 — Hero.
 * Phone: headline, then one portrait filling the rest of the first screen with the CTAs on the white shirt.
 * Desktop: two-line headline over a text column + three studio portraits at native ratio (no upscaling, no crop).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-ivory">
      <div
        className={clsx(
          "hero-grid wrap grid grid-cols-1",
          // phone: exactly the first screen (header + preview bar excluded); image row takes what's left
          "max-md:h-[calc(100svh-var(--header-h)-var(--notice-h))] max-md:max-h-[58rem] max-md:min-h-[33rem] max-md:grid-rows-[auto_minmax(0,1fr)]",
          "lg:grid-cols-12 lg:gap-x-[var(--grid-gap)] lg:pb-[var(--section-y-sm)]",
        )}
      >
        <div className="pt-5 pb-5 md:pt-10 md:pb-8 lg:col-span-12 lg:pt-12">
          <h1 id="hero-title" className="t-hero">
            <span className="mask-line">
              <span>Not made</span>
            </span>
            <span className="mask-line lg:inline-block!">
              <span style={{ animationDelay: "0.1s" }}>to blend</span>
            </span>{" "}
            <span className="mask-line lg:inline-block!">
              <span style={{ animationDelay: "0.2s" }}>in.</span>
            </span>
          </h1>
          <p className="eyebrow fade-in mt-3 text-stone [animation-delay:0.5s] md:hidden">Rings · Chain &amp; Lockets · Bracelets</p>
        </div>

        {/* CTAs — overlaid on the portrait (phone), own row (tablet), text column (desktop) */}
        <div
          className={clsx(
            "fade-in relative z-10 [animation-delay:0.6s]",
            "max-md:col-start-1 max-md:row-start-2 max-md:self-end max-md:pb-5",
            "md:pb-8 lg:col-span-3 lg:row-start-2 lg:self-start lg:pb-0",
          )}
        >
          <p className="t-lead hidden max-w-[22rem] text-graphite md:block">
            Statement rings, chains and bracelets. Shipping all over Pakistan.
          </p>
          <div className="grid grid-cols-2 gap-2 md:mt-6 md:flex lg:flex-col">
            <Link href="/shop" className="btn btn-dark">
              Shop all <IconArrow size={16} />
            </Link>
            <Link href="/shop/chains" className="btn btn-outline bg-ivory">
              Chain &amp; Lockets
            </Link>
          </div>
        </div>

        <ul
          className={clsx(
            "relative max-md:col-start-1 max-md:row-start-2 max-md:-mx-[var(--gutter)] max-md:h-full",
            "md:grid md:grid-cols-3 md:gap-[var(--grid-gap)] lg:col-span-9 lg:col-start-4 lg:row-start-2",
          )}
        >
          {FRAMES.map((f, i) => (
            <li key={f.id} className={clsx(i > 0 && "max-md:hidden", "max-md:h-full")}>
              <Link href={f.href} className="group block max-md:h-full" aria-label={f.name}>
                <div className="hero-frame relative overflow-hidden max-md:h-full" style={{ "--d": `${150 + i * 140}ms` } as React.CSSProperties}>
                  <div className="ratio-tall max-md:hidden" />
                  <div className="frame-zoom absolute inset-0">
                    <Photo
                      id={f.id}
                      priority={i === 0}
                      sizes={i === 0 ? "(min-width:1024px) 26vw, (min-width:768px) 32vw, 100vw" : "(min-width:1024px) 26vw, 32vw"}
                      position={f.focus}
                      className="absolute inset-0"
                    />
                  </div>
                </div>
                <p className="mt-3 hidden items-baseline justify-between gap-3 md:flex">
                  <span className="t-small link-line link-group">{f.name}</span>
                  <span className="eyebrow text-stone">0{i + 1}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
