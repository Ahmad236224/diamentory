import Link from "next/link";
import clsx from "clsx";
import { SITE } from "@/content/site";
import { JewelArt } from "@/components/art/JewelArt";
import { STUDIES } from "./studies";
import { SectionHead } from "./SectionHead";

const PICK: { id: string; place: string; aspect: string }[] = [
  { id: "weight", place: "col-span-7 lg:col-span-4 lg:row-span-2", aspect: "aspect-[4/5] lg:aspect-auto lg:flex-1" },
  { id: "contrast", place: "col-span-5 mt-16 lg:col-span-3 lg:mt-0", aspect: "aspect-[3/4]" },
  { id: "tonal", place: "col-span-5 mt-3 lg:col-span-2 lg:mt-24", aspect: "aspect-square" },
  { id: "orbit", place: "col-span-7 mt-3 lg:col-span-3 lg:col-start-6 lg:mt-0", aspect: "aspect-[5/4]" },
  { id: "focus", place: "col-span-6 col-start-4 mt-3 lg:col-span-3 lg:col-start-10 lg:-mt-24", aspect: "aspect-[4/5]" },
];

/** 08 — Styled moments: lookbook teaser. */
export function StyledMoments() {
  return (
    <section aria-labelledby="moments-title" className="gutter mx-auto max-w-[1800px] pb-24 lg:pb-40">
      <SectionHead
        index="08"
        eyebrow="Styled moments"
        id="moments-title"
        title={
          <>
            Studies in <em className="italic">presence.</em>
          </>
        }
        link={{ href: "/lookbook", label: "View the lookbook" }}
      />

      <ul className="mt-10 grid grid-cols-12 gap-3 lg:mt-16 lg:gap-6">
        {PICK.map((p) => {
          const s = STUDIES.find((x) => x.id === p.id);
          if (!s) return null;
          return (
            <li key={s.id} className={clsx("reveal", p.place)}>
              <Link href={`/lookbook#${s.id}`} className="group flex h-full flex-col" aria-label={`${s.title} — ${s.note} View in the lookbook`}>
                <div className={clsx("relative overflow-hidden", p.aspect)}>
                  <JewelArt
                    form={s.form}
                    finish={s.finish}
                    tone={s.tone}
                    crop={s.crop}
                    rotate={s.rotate}
                    className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                  />
                </div>
                <span className="eyebrow mt-2 block text-[0.625rem] text-stone">{s.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.85rem] text-graphite lg:mt-14">
        More moments on Instagram
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="eyebrow link-line inline-flex min-h-11 items-center text-obsidian">
          {SITE.instagramHandle}
          <span aria-hidden="true" className="ml-2">
            ↗
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
