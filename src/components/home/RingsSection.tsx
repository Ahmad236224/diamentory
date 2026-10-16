import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { getCategory } from "@/lib/catalog";
import { FrameCaption, SectionHead } from "./SectionHead";

/** Square crops sit on the ring itself (studio frames are 9:16, ring at ~50% height). */
const DETAILS = [
  { id: "product-ring-textured-band-gold", href: "/product/textured-band-ring", name: "Textured Band Ring", focus: "50% 53%" },
  { id: "product-ring-stone-band-two-tone", href: "/product/stone-band-ring", name: "Stone Band Ring", focus: "50% 55%" },
  { id: "product-ring-brushed-band-silver", href: "/product/brushed-band-ring", name: "Brushed Band Ring", focus: "50% 48%" },
  { id: "brand-sword-ring-marble", href: "/product/sword-wrap-ring", name: "Sword Wrap Ring", focus: "50% 55%", mono: true },
];

/** 01 — Rings. Black chapter: one studio portrait, then the hand-and-ring details as square macro crops. */
export function RingsSection() {
  const cat = getCategory("rings")!;
  return (
    <section aria-labelledby="rings-title" className="section bg-obsidian text-ivory">
      <div className="wrap">
        <SectionHead n="01" label={cat.name} href="/shop/rings" cta="Shop rings" tone="dark" />

        <div className="mt-8 grid gap-y-10 lg:mt-12 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <h2 id="rings-title" className="t-h2 reveal">
              Small form.
              <br />
              <em>Full statement.</em>
            </h2>
            <p className="reveal mt-5 max-w-[26rem] text-champagne" style={{ "--d": "100ms" } as React.CSSProperties}>
              Bands and statement rings — textured, polished and stone-set.
            </p>
          </div>

          <Link
            href="/product/textured-wrap-ring"
            className="group block lg:col-span-6 lg:row-span-2 lg:row-start-1"
          >
            <div className="reveal-mask ratio-card relative overflow-hidden">
              <div className="frame-zoom absolute inset-0">
                <Photo
                  id="product-ring-textured-wrap-two-tone"
                  dark
                  sizes="(min-width:1024px) 42vw, 100vw"
                  position="50% 52%"
                  className="absolute inset-0"
                />
              </div>
            </div>
            <FrameCaption name="Two-Tone Wrap Ring" note="Statement" tone="dark" />
          </Link>

          <ul className="reveal-stagger grid grid-cols-2 gap-[var(--grid-gap)] lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-end">
            {DETAILS.map((d) => (
              <li key={d.id}>
                <Link href={d.href} className="group block">
                  <div className="ratio-square relative overflow-hidden">
                    <div className="frame-zoom absolute inset-0">
                      <Photo
                        id={d.id}
                        dark
                        mono={d.mono}
                        sizes="(min-width:1024px) 20vw, 45vw"
                        position={d.focus}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                  <FrameCaption name={d.name} tone="dark" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
