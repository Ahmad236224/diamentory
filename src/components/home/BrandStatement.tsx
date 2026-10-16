import { Photo } from "@/components/media/Photo";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { SITE } from "@/content/site";

const FEED = [
  "brand-franco-chain-black-drape",
  "brand-sword-ring-on-hand",
  "brand-iced-cuban-bracelet-fist",
  "brand-black-iced-cuban-chains-hand",
  "brand-lightning-pendant-bust",
  "brand-franco-bracelets-silver-gold",
];

/** 09 — Brand statement, in Diamentory's own words, with its own photography. */
export function BrandStatement() {
  return (
    <section aria-labelledby="statement-title" className="bg-obsidian pt-16 pb-6 text-ivory lg:pt-28">
      <div className="gutter mx-auto max-w-[1800px]">
        <p className="eyebrow reveal text-champagne">Diamentory</p>
        <h2 id="statement-title" className="reveal display mt-5 text-[clamp(2.6rem,10.5vw,11rem)] leading-[0.82]">
          It&apos;s all
          <br />
          about <span className="text-accent">quality.</span>
        </h2>
        <div className="reveal mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-md text-[0.95rem] leading-relaxed text-ivory/70">
            Orders and questions are answered directly on Instagram. Shipping all over Pakistan.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex min-h-12 items-center gap-3 self-start border border-ivory/50 px-6 transition-colors hover:border-ivory hover:bg-ivory hover:text-obsidian"
          >
            <IconInstagram size={18} /> {SITE.instagramHandle} <IconArrow size={16} />
            <span className="sr-only">(opens Instagram in a new tab)</span>
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-3 gap-1.5 lg:mt-16 lg:grid-cols-6 lg:gap-2" aria-label="Recent posts from Diamentory on Instagram">
          {FEED.map((id) => (
            <li key={id} className="group">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="block" tabIndex={-1} aria-hidden="true">
                <Photo
                  id={id}
                  mono
                  // the Franco frame carries an old watermark top-right — crop it away
                  imgClassName={id === "brand-franco-chain-black-drape" ? "origin-bottom-left scale-[1.22]" : undefined}
                  sizes="(min-width:1024px) 16vw, 33vw"
                  className="aspect-square opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
