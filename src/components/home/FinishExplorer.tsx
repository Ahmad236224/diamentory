import Link from "next/link";
import { FINISHES, queryProducts } from "@/lib/catalog";
import type { ArtForm, Finish } from "@/lib/catalog/types";
import { JewelArt } from "@/components/art/JewelArt";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHead } from "./SectionHead";
import { FinishTabs } from "./FinishTabs";

const ART: Record<Finish, { form: ArtForm; tone: "ivory" | "stone" | "dark"; crop: [number, number, number, number]; rotate: number }> = {
  gold: { form: "cuban-bracelet", tone: "dark", crop: [180, 420, 640, 520], rotate: -10 },
  silver: { form: "tennis-chain", tone: "stone", crop: [140, 560, 640, 520], rotate: 6 },
  black: { form: "box-chain", tone: "stone", crop: [160, 540, 640, 520], rotate: -4 },
  "two-tone": { form: "cuban-chain", tone: "dark", crop: [200, 600, 600, 500], rotate: 12 },
};

/** 05 — Explore by finish: real products filtered by finish, switched with an accessible tablist. */
export function FinishExplorer() {
  const panels = FINISHES.map((f) => {
    const products = queryProducts({ finish: [f.slug] }).slice(0, 4);
    const a = ART[f.slug];
    return (
      <div key={f.slug} className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-3">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-[4/5]">
            <JewelArt form={a.form} finish={f.slug} tone={a.tone} crop={a.crop} rotate={a.rotate} className="absolute inset-0" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="display text-[1.6rem] italic lg:text-[2rem]">{f.note}</p>
          </div>
          <Link href={`/collections/${f.slug}`} className="eyebrow link-line mt-3 inline-flex min-h-11 items-center">
            All {f.name.toLowerCase()} pieces <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 lg:col-span-8 lg:col-start-5 lg:grid-cols-4 lg:gap-x-6">
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} finish={f.slug} sizes="(min-width:1024px) 16vw, 46vw" />
            </li>
          ))}
        </ul>
      </div>
    );
  });

  return (
    <section aria-labelledby="finish-title" className="gutter mx-auto max-w-[1800px] py-24 lg:py-40">
      <SectionHead
        index="05"
        eyebrow="Explore by finish"
        id="finish-title"
        title={
          <>
            Choose your <em className="italic">tone.</em>
          </>
        }
        link={{ href: "/collections", label: "All collections" }}
      />
      <div className="mt-10 lg:mt-14">
        <FinishTabs label="Finish" tabs={FINISHES.map((f) => ({ id: f.slug, label: f.name }))} panels={panels} />
      </div>
    </section>
  );
}
