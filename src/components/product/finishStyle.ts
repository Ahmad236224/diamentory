/** Finish labels + swatches. Plain module so server components can read them. */
import type { Finish } from "@/lib/catalog/types";

export const FINISH_LABEL: Record<Finish, string> = {
  gold: "Gold",
  silver: "Silver",
  black: "Black",
  "two-tone": "Two-Tone",
};

export const FINISH_SWATCH: Record<Finish, string> = {
  gold: "linear-gradient(135deg,#7a5b2a,#e8cf92 45%,#b08442)",
  silver: "linear-gradient(135deg,#6b6e71,#f4f5f6 45%,#9a9da0)",
  black: "linear-gradient(135deg,#050505,#4d4a46 45%,#141312)",
  "two-tone": "linear-gradient(135deg,#b08442 0 50%,#c9cccf 50% 100%)",
};
