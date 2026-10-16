import Link from "next/link";
import { SITE } from "@/content/site";
import { IconArrow, IconInstagram } from "@/components/ui/icons";

/** Closing band on client-care pages. Instagram DM is the confirmed contact channel. */
export function HelpBand() {
  return (
    <aside aria-labelledby="help-band-h" className="border-t border-obsidian/10">
      <div className="wrap section-sm grid-12 gap-y-6">
        <p className="eyebrow col-span-12 text-stone lg:col-span-3 lg:pt-3">Client care</p>
        <div className="reveal col-span-12 lg:col-span-8 lg:col-start-5">
          <h2 id="help-band-h" className="t-h2">
            Still have a <em>question?</em>
          </h2>
          <p className="mt-5 max-w-[42ch] text-graphite">
            Send us a message on Instagram — it is the quickest way to reach Diamentory today.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <InstagramButton />
            <Link href="/faq" className="btn btn-outline">
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
      className={tone === "dark" ? "btn btn-dark" : "btn btn-light"}
    >
      <IconInstagram size={18} />
      {label}
      <IconArrow size={16} />
      <span className="sr-only">(opens Instagram in a new tab)</span>
    </a>
  );
}
