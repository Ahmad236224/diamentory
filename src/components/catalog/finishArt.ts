import { FINISHES, queryProducts, type Finish } from "@/lib/catalog";
import { photosFor } from "@/components/product/ProductMedia";

/** Finishes that actually have pieces (an empty finish gets no index entry and its page 404s). */
export function activeFinishes() {
  return FINISHES.filter((f) => queryProducts({ finish: [f.slug] }).length > 0);
}

/** Real photos for a finish: the finish-specific frame of each matching piece, featured first. */
export function finishPhotos(finish: Finish, n: number) {
  return queryProducts({ finish: [finish] })
    .slice(0, n)
    .map((p) => ({ ...photosFor(p, finish)[0], href: `/product/${p.slug}?finish=${finish}` }));
}
