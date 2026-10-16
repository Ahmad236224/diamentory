import Link from "next/link";
import { JewelArt } from "@/components/art/JewelArt";

/** 07 — Brand story teaser. Point of view only: no invented history, materials or process claims. */
export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="gutter mx-auto max-w-[1800px] py-24 lg:py-40">
      <div className="grid grid-cols-12 gap-x-3 lg:gap-x-6">
        <p className="eyebrow col-span-12 flex items-center gap-3 text-stone lg:col-span-3">
          <span className="tabular-nums">07</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          <span>The house view</span>
        </p>

        <div className="col-span-12 mt-6 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 id="story-title" className="display text-[clamp(2rem,7.6vw,3.9rem)] leading-[1]">
            Diamentory is for the ones who <em className="italic">decide for themselves</em> — what to wear, how to wear it, and
            what it says.
          </h2>
        </div>

        <div className="reveal col-span-5 col-start-1 mt-12 lg:col-span-3 lg:col-start-1 lg:mt-20">
          <div className="relative aspect-[3/4] overflow-hidden">
            <JewelArt form="stone-ring" finish="silver" tone="dark" crop={[250, 260, 500, 640]} rotate={-6} className="absolute inset-0" />
          </div>
        </div>

        <div className="col-span-7 col-start-6 mt-12 self-end lg:col-span-5 lg:col-start-6 lg:mt-20">
          <div className="space-y-4 text-[0.92rem] leading-relaxed text-graphite lg:text-[1rem]">
            <p>
              We see jewellery as a point of view rather than a finishing touch. A chain worn alone. A stack that only makes
              sense to you. Gold against black, silver against skin.
            </p>
            <p className="hidden sm:block">
              No rules about how much is too much. Just pieces with presence, for people with their own.
            </p>
          </div>
          <Link href="/our-story" className="eyebrow link-line mt-6 inline-flex min-h-11 items-center">
            Our story <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
