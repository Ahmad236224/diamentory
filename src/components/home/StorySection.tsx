import { Photo } from "@/components/media/Photo";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { SITE } from "@/content/site";
import { SectionHead } from "./SectionHead";

/** Instagram frames are small (360–720 px): square thumbnails only. */
const GRAM = [
  { id: "brand-ali-pendant-snake-chain", focus: "50% 58%" },
  { id: "brand-iced-cuban-bracelets-packaged", focus: "50% 50%" },
  { id: "brand-lightning-pendant-bust", focus: "50% 62%" },
  { id: "brand-sword-ring-on-hand", focus: "50% 45%" },
  { id: "brand-black-iced-cuban-chains-hand", focus: "50% 50%" },
  { id: "brand-franco-bracelets-silver-gold", focus: "50% 50%" },
];

/** 05 — Brand, in its own words ("It's all about quality." is the line on the Diamentory logo). */
export function StorySection() {
  return (
    <section aria-labelledby="story-title" className="section bg-paper">
      <div className="wrap">
        <SectionHead n="05" label="Diamentory" href="/our-story" cta="Our story" />

        <div className="mt-8 grid gap-y-10 lg:mt-12 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
          <h2 id="story-title" className="t-h1 reveal lg:col-span-8">
            It&rsquo;s all about <em>quality.</em>
          </h2>
          <ul className="reveal-stagger grid gap-y-5 self-end sm:grid-cols-2 sm:gap-x-[var(--grid-gap)] lg:col-span-4 lg:grid-cols-1">
            <li className="border-t border-obsidian/10 pt-4">
              <p className="eyebrow">Delivery</p>
              <p className="mt-2 text-graphite">Shipping all over Pakistan.</p>
            </li>
            <li className="border-t border-obsidian/10 pt-4">
              <p className="eyebrow">Ordering</p>
              <p className="mt-2 text-graphite">Order here, or send us a DM on Instagram.</p>
            </li>
          </ul>
        </div>

        <div className="mt-14 lg:mt-20">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group link-arrow flex min-h-12 items-center justify-between gap-4"
          >
            <span className="eyebrow flex items-center gap-3">
              <IconInstagram /> <span className="link-line link-group">{SITE.instagramHandle}</span>
            </span>
            <span className="eyebrow hidden items-center gap-2 sm:flex">
              Follow on Instagram <IconArrow size={14} />
            </span>
            <span className="sr-only">(opens Instagram in a new tab)</span>
          </a>
          <ul className="reveal-stagger mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-[var(--grid-gap)]" aria-hidden="true">
            {GRAM.map((g) => (
              <li key={g.id}>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="group block" tabIndex={-1}>
                  <div className="ratio-square relative overflow-hidden">
                    <div className="frame-zoom absolute inset-0">
                      <Photo id={g.id} dark alt="" sizes="(min-width:640px) 15vw, 31vw" position={g.focus} className="absolute inset-0" />
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
