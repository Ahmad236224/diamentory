import type { ArtForm, Finish } from "@/lib/catalog";

/** Art direction for each finish collection. */
export const FINISH_ART: Record<
  Finish,
  { form: ArtForm; tone: "ivory" | "stone" | "dark"; crop: [number, number, number, number]; rotate?: number }
> = {
  gold: { form: "cuban-chain", tone: "dark", crop: [100, 300, 800, 640], rotate: -10 },
  silver: { form: "tennis-bracelet", tone: "stone", crop: [80, 240, 840, 670], rotate: 8 },
  black: { form: "band-ring", tone: "dark", crop: [160, 200, 680, 545], rotate: -6 },
  "two-tone": { form: "set", tone: "stone", crop: [40, 160, 920, 735], rotate: -4 },
};
