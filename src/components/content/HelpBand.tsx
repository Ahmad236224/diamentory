import Link from "next/link";
import { SITE } from "@/content/site";
import { IconArrow, IconInstagram } from "@/components/ui/icons";

/** Closing band on client-care pages. Instagram DM is the confirmed contact channel. */
export function HelpBand() {
  return (
    <aside aria-labelledby="help-band-h" className="border-t border-obsidian/10">
      <div className="gutter mx-auto grid max-w-[1800px] gap-8 py-16 lg:grid-cols-12 lg:gap-x-8 lg:py-24">
        <p className="eyebrow text-stone lg:col-span-3 lg:pt-3">Client care</p>
        <div className="lg:col-span-9">
          <h2 id="help-band-h" className="display text-[clamp(2.2rem,7vw,4.5rem)]">
            Still have a <em>question?</em>
          </h2>
          <p className="mt-5 max-w-[42ch] text-graphite">
            Send us a message on Instagram — it is the quickest way to reach Diamentory today.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <InstagramButton />
            <Link
              href="/faq"
              className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 border border-obsidian px-6"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function InstagramButton({ label = `Message ${SITE.instagramHandle}`, tone = "dark" }: { label?: string; tone?: "dark" | "light" }) {
  return (
    <a
      href={SITE.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={
        tone === "dark"
          ? "eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-obsidian px-6 text-ivory"
          : "eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-ivory px-6 text-obsidian"
      }
    >
      <IconInstagram size={18} />
      {label}
      <IconArrow size={16} />
      <span className="sr-only">(opens Instagram in a new tab)</span>
    </a>
  );
}
