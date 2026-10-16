import Link from "next/link";
import { JewelArt } from "@/components/art/JewelArt";

/** 04 — Statement editorial: full-bleed dark moment with scroll-driven parallax (CSS only). */
export function StatementEditorial() {
  return (
    <section aria-labelledby="statement-title" className="relative overflow-hidden bg-obsidian text-ivory">
      <div className="relative mx-auto grid min-h-[100svh] max-w-[1800px] grid-rows-[1fr_auto] lg:min-h-[110vh]">
        {/* parallax still life — right-weighted, bleeding off edge */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 left-[18%] overflow-hidden lg:left-[38%]">
          <div className="parallax-img absolute inset-0">
            <JewelArt form="rope-chain" finish="gold" tone="dark" crop={[60, 260, 820, 1000]} rotate={14} className="absolute inset-0" />
          </div>
          <div className="absolute inset-0 bg-obsidian/35 lg:bg-transparent lg:bg-[linear-gradient(90deg,#101010_0%,rgba(16,16,16,0.2)_45%,rgba(16,16,16,0)_100%)]" />
        </div>

        <div className="gutter relative z-10 pt-20 lg:pt-32">
          <p className="eyebrow flex items-center gap-3 text-champagne">
            <span className="tabular-nums">04</span>
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
            <span>Point of view</span>
          </p>
        </div>

        <div className="gutter relative z-10 pb-16 lg:pb-28">
          <h2 id="statement-title" className="display text-[clamp(3rem,15vw,11.5rem)] leading-[0.88]">
            <span className="block">Some things</span>
            <span className="block pl-[12%] italic text-champagne">don&rsquo;t need</span>
            <span className="block">explaining.</span>
          </h2>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mt-14">
            <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-ivory/75">
              Chains, rings and pendants that say it before you do. Worn heavy or worn alone — the decision is yours.
            </p>
            <Link
              href="/shop/chains"
              className="eyebrow inline-flex min-h-12 items-center justify-center self-start border border-ivory/60 px-7 transition-colors hover:bg-ivory hover:text-obsidian sm:self-auto"
            >
              Shop chains
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
