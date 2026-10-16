import Link from "next/link";

/** 09 — Closing brand statement before the footer. */
export function FinalStatement() {
  return (
    <section aria-labelledby="final-title" className="border-t border-obsidian/10">
      <div className="gutter mx-auto max-w-[1800px] py-24 text-center lg:py-40">
        <p className="eyebrow text-stone">Diamentory</p>
        <h2 id="final-title" className="display mx-auto mt-6 max-w-[14ch] text-[clamp(2.6rem,11vw,9rem)] leading-[0.92]">
          Make it <em className="italic">unmistakably</em> yours.
        </h2>
        <div className="mt-12 flex lg:mt-16 flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/collections"
            className="eyebrow inline-flex min-h-12 w-full items-center justify-center bg-obsidian px-8 text-ivory transition-colors hover:bg-graphite sm:w-auto"
          >
            Explore Collections
          </Link>
          <Link
            href="/new-arrivals"
            className="eyebrow inline-flex min-h-12 w-full items-center justify-center border border-obsidian px-8 transition-colors hover:bg-obsidian hover:text-ivory sm:w-auto"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
