import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/content/site";
import { JewelArt } from "@/components/art/JewelArt";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Diamentory's point of view: jewellery as personal expression — for individuality, confidence and the freedom to define your own style.",
  alternates: { canonical: "/our-story" },
  openGraph: { title: "Our Story — DIAMENTORY", url: "/our-story" },
};

const PRINCIPLES = [
  {
    n: "i",
    title: "Individuality",
    body: "No uniform, no dress code. The right piece is the one that feels like you — whether that is one fine chain or a full stack.",
  },
  {
    n: "ii",
    title: "Confidence",
    body: "Statement jewellery is not about volume. It is about wearing something without asking anyone's permission.",
  },
  {
    n: "iii",
    title: "Expression",
    body: "Gold, silver, black, two-tone. Mixed, matched or worn alone. Every combination is a sentence only you can write.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <section className="mx-auto max-w-[1800px] px-[var(--gutter)] pt-14 lg:pt-24">
        <div className="grid grid-cols-12 gap-x-3 lg:gap-x-6">
          <p className="eyebrow col-span-12 text-stone lg:col-span-3">Our story</p>
          <h1 className="display col-span-12 mt-4 text-[clamp(2.75rem,12.5vw,9.5rem)] lg:col-span-9 lg:mt-0">
            Jewellery as a <em className="italic">point of view.</em>
          </h1>
        </div>
      </section>

      <section aria-label="Introduction" className="mx-auto mt-14 grid max-w-[1800px] grid-cols-12 gap-x-3 px-[var(--gutter)] lg:mt-24 lg:gap-x-6">
        <div className="clip-in relative col-span-12 aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:col-span-7 lg:aspect-[5/4]">
          <JewelArt form="cuban-chain" finish="gold" tone="dark" crop={[180, 480, 640, 700]} rotate={-12} title="Study of a gold Cuban link chain" className="absolute inset-0" />
        </div>
        <div className="col-span-12 mt-10 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end">
          <div className="space-y-5 text-[1rem] leading-relaxed text-graphite lg:text-[1.05rem]">
            <p className="display text-[1.6rem] leading-[1.15] text-obsidian lg:text-[2rem]">
              Diamentory exists for people who define their own style — and wear it like they mean it.
            </p>
            <p>
              We think of jewellery less as decoration and more as language. What you choose to wear says something before you
              do: about how you see yourself, and how you choose to be seen.
            </p>
            <p>
              So we focus on pieces with presence. Chains, bracelets, rings and pendants in gold, silver, black and two-tone —
              made to be worn alone or layered into something entirely your own.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles" className="mx-auto max-w-[1800px] px-[var(--gutter)] py-24 lg:py-40">
        <h2 id="principles" className="eyebrow text-stone">What we stand for</h2>
        <ol className="mt-8 border-t border-obsidian/10">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="reveal grid grid-cols-12 gap-x-3 border-b border-obsidian/10 py-8 lg:gap-x-6 lg:py-12">
              <span className="col-span-2 font-serif text-[1.1rem] text-stone italic lg:col-span-1">{p.n}</span>
              <h3 className="display col-span-10 text-[clamp(2rem,8vw,4.5rem)] lg:col-span-5">{p.title}</h3>
              <p className="col-span-10 col-start-3 mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed text-graphite lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-center">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="story-close" className="bg-champagne/40">
        <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-x-3 px-[var(--gutter)] py-20 lg:gap-x-6 lg:py-32">
          <div className="relative col-span-5 aspect-[3/4] overflow-hidden lg:col-span-3">
            <JewelArt form="signet-ring" finish="silver" tone="dark" crop={[220, 300, 560, 700]} rotate={8} className="absolute inset-0" />
          </div>
          <div className="col-span-7 self-end pl-2 lg:col-span-7 lg:col-start-5 lg:pl-0">
            <h2 id="story-close" className="display text-[clamp(2rem,9vw,6.5rem)]">
              Wear your <em className="italic">distinction.</em>
            </h2>
          </div>
          <div className="col-span-12 mt-10 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:col-span-8 lg:col-start-5">
            <Link
              href="/collections"
              className="eyebrow inline-flex min-h-12 items-center justify-center bg-obsidian px-8 text-ivory transition-colors hover:bg-graphite"
            >
              Explore Collections
            </Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-8 transition-colors hover:bg-obsidian hover:text-ivory"
            >
              Follow {SITE.instagramHandle} <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
