import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { IconArrow } from "@/components/ui/icons";

/** 07 — Sets. A single cinematic frame: layering as a point of view. */
export function SetsSection() {
  return (
    <section aria-labelledby="sets-title" className="relative isolate overflow-hidden bg-obsidian text-ivory">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[88svh] lg:max-h-[900px]">
        <Photo
          id="editorial-layered-chains-hand"
          mono
          sizes="100vw"
          position="50% 40%"
          alt="Black-and-white close-up of layered silver chains worn over a black T-shirt"
          className="parallax-img absolute inset-0"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 gutter pb-8 lg:pb-14">
          <p className="eyebrow reveal">07 — Sets &amp; stacks</p>
          <h2 id="sets-title" className="reveal display mt-4 text-[clamp(2rem,9vw,8.5rem)] leading-[0.84]">
            Wear them
            <br />
            together.
          </h2>
          <div className="reveal mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ivory/75">Chains, bracelets and rings — matched to be layered.</p>
            <Link
              href="/shop/sets"
              className="eyebrow inline-flex min-h-12 items-center gap-3 bg-ivory px-6 text-obsidian transition-colors hover:bg-accent hover:text-ivory"
            >
              Shop sets <IconArrow size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
