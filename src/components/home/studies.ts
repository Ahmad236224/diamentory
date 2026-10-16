import type { ArtForm, Finish } from "@/lib/catalog/types";

/**
 * Art-directed still-life studies used by the lookbook and the homepage
 * "styled moments" teaser. Each one points at the catalogue product it depicts;
 * if that product is missing from the catalogue the shop link is simply omitted.
 */
export interface Study {
  id: string;
  title: string;
  note: string;
  form: ArtForm;
  finish: Finish;
  tone: "ivory" | "stone" | "dark";
  crop: [number, number, number, number];
  rotate?: number;
  product: string;
}

export const STUDIES: Study[] = [
  {
    id: "weight",
    title: "Weight",
    note: "Gold Cuban link, close to the skin.",
    form: "cuban-chain",
    finish: "gold",
    tone: "dark",
    crop: [230, 560, 560, 700],
    rotate: -9,
    product: "cuban-link-chain",
  },
  {
    id: "signature",
    title: "Signature",
    note: "A signet, read from above.",
    form: "signet-ring",
    finish: "gold",
    tone: "stone",
    crop: [230, 300, 540, 540],
    rotate: 0,
    product: "signet-ring",
  },
  {
    id: "contrast",
    title: "Contrast",
    note: "Two tones, one line.",
    form: "cuban-chain",
    finish: "two-tone",
    tone: "stone",
    crop: [80, 420, 520, 650],
    rotate: 12,
    product: "two-tone-cuban-chain",
  },
  {
    id: "orbit",
    title: "Orbit",
    note: "Silver tennis bracelet in a slow arc.",
    form: "tennis-bracelet",
    finish: "silver",
    tone: "dark",
    crop: [160, 420, 680, 520],
    rotate: -6,
    product: "tennis-bracelet",
  },
  {
    id: "tonal",
    title: "Tonal",
    note: "Black on stone. Nothing else needed.",
    form: "band-ring",
    finish: "black",
    tone: "stone",
    crop: [200, 380, 600, 640],
    rotate: 8,
    product: "black-band",
  },
  {
    id: "symbol",
    title: "Symbol",
    note: "The cross pendant, suspended.",
    form: "pendant-cross",
    finish: "gold",
    tone: "dark",
    crop: [290, 640, 420, 560],
    rotate: 4,
    product: "cross-pendant",
  },
  {
    id: "edge",
    title: "Edge",
    note: "A sculpted cuff, catching the light.",
    form: "cuff",
    finish: "silver",
    tone: "stone",
    crop: [150, 320, 700, 560],
    rotate: -10,
    product: "sculpted-cuff",
  },
  {
    id: "focus",
    title: "Focus",
    note: "One stone, set to be seen.",
    form: "stone-ring",
    finish: "two-tone",
    tone: "dark",
    crop: [260, 260, 480, 560],
    rotate: 0,
    product: "statement-stone-ring",
  },
  {
    id: "composed",
    title: "Composed",
    note: "Chain and bracelet, worn as one.",
    form: "set",
    finish: "gold",
    tone: "stone",
    crop: [60, 200, 880, 1000],
    rotate: 0,
    product: "chain-and-bracelet-set",
  },
];
