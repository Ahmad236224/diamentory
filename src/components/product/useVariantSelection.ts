"use client";

import { useMemo, useState } from "react";
import type { Finish, Product } from "@/lib/catalog/types";
import { productFinishes } from "@/lib/catalog";

export { FINISH_LABEL, FINISH_SWATCH } from "./finishStyle";

export function useVariantSelection(product: Product, initialFinish?: Finish) {
  const finishes = productFinishes(product);
  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))],
    [product],
  );
  const firstInStock = product.variants.find((v) => v.stock > 0);
  const [finish, setFinish] = useState<Finish>(
    initialFinish && finishes.includes(initialFinish) ? initialFinish : (firstInStock?.finish ?? finishes[0]),
  );
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);

  const needsSize = sizes.length > 0;
  const variant = product.variants.find((v) => v.finish === finish && (needsSize ? v.size === size : true));

  const sizeAvailability = (s: string) => {
    const v = product.variants.find((x) => x.finish === finish && x.size === s);
    if (!v) return "none" as const;
    return v.stock > 0 ? ("in" as const) : ("out" as const);
  };
  const finishAvailable = (f: Finish) => product.variants.some((v) => v.finish === f && v.stock > 0);

  return {
    finishes,
    sizes,
    finish,
    setFinish: (f: Finish) => {
      setFinish(f);
      // keep size only if it exists for the new finish
      if (size && !product.variants.some((v) => v.finish === f && v.size === size)) setSize(null);
    },
    size,
    setSize,
    needsSize,
    variant,
    sizeAvailability,
    finishAvailable,
  };
}
