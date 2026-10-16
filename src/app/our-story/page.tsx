import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/content/site";
import { getProduct } from "@/lib/catalog";
import { PageHeader } from "@/components/catalog/CatalogHeader";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Diamentory's point of view: jewellery as personal expression — for individuality, confidence and the freedom to define your own style.",
  alternates: { canonical: "/our-story" },
  openGraph: { title: "Our Story — DIAMENTORY", url: "/our-story" },
};

const PRINCIPLES = [
  {
    title: "Individuality",
    body: "No uniform, no dress code. The right piece is the one that feels like you — whether that is one fine chain or a full stack.",
  },
  {
    title: "Confidence",
    body: "Statement jewellery is not about volume. It is about wearing something without asking anyone's permission.",
  },
  {
    title: "Expression",
    body: "Gold, silver, two-tone. Mixed, matched or worn alone. Every combination is a sentence only you can write.",
  },
];

/** Real studio frames from the catalogue (768px wide — shown in columns, never full-bleed on desktop). */
const photo = (slug: string, i = 0) => getProduct(slug)?.images[i];
const INTRO = photo("cuban-link-chain");
const CLOSE = photo("textured-band-ring");

export default function OurStoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title={
          <>
            Jewellery as a <em>point of view.</em>
          </>
        }
      />

      <section aria-label="Introduction" className="wrap grid-12 gap-y-10">
        {INTRO && (
          <div className="reveal-mask relative col-span-12 ratio-portrait overflow-hidden bg-paper sm:col-span-8 lg:col-span-5">
            <Image
              src={INTRO.src}
              alt={INTRO.alt}
              fill
              priority
              sizes="(min-width:1024px) 34vw, (min-width:640px) 66vw, 100vw"
              className="object-cover"
              style={{ objectPosition: INTRO.focus }}
            />
          </div>
        )}
        <div className="reveal col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
          <p className="t-h3 normal-case">
            Diamentory exists for people who define their own style — and wear it like they mean it.
          </p>
          <div className="mt-6 space-y-5 text-graphite">
            <p>
              We think of jewellery less as decoration and more as language. What you choose to wear says something
              before you do: about how you see yourself, and how you choose to be seen.
            </p>
            <p>
              So we focus on pieces with presence. Rings, chains &amp; lockets, and bracelets in gold, silver and
              two-tone — made to be worn alone or layered into something entirely your own.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles" className="wrap section">
        <h2 id="principles" className="eyebrow text-stone">
          What we stand for
        </h2>
        <ol className="mt-8 border-t border-obsidian/10">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="reveal grid-12 border-b border-obsidian/10 py-8 lg:py-12">
              <span className="eyebrow col-span-2 pt-2 text-stone tabular-nums lg:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h2 col-span-12 mt-2 sm:col-span-10 sm:mt-0 lg:col-span-6">{p.title}</h3>
              <p className="col-span-12 mt-3 sm:col-span-10 sm:col-start-3 max-w-[44ch] text-graphite lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-center">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="story-close" className="bg-paper">
        <div className="wrap section grid-12 gap-y-10">
          {CLOSE && (
            <div className="reveal-mask relative col-span-6 ratio-portrait overflow-hidden sm:col-span-4 lg:col-span-3">
              <Image
                src={CLOSE.src}
                alt={CLOSE.alt}
                fill
                sizes="(min-width:1024px) 20vw, 40vw"
                className="object-cover"
                style={{ objectPosition: CLOSE.focus }}
              />
            </div>
          )}
          <div className="col-span-12 self-end lg:col-span-8 lg:col-start-5">
            <h2 id="story-close" className="t-h1 reveal">
              Wear your <em>distinction.</em>
            </h2>
          </div>
          <div className="col-span-12 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:col-span-8 lg:col-start-5">
            <Link href="/shop" className="btn btn-dark">
              Shop the collection
            </Link>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Follow {SITE.instagramHandle} <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
