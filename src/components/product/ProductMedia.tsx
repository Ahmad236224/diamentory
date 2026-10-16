import Image from "next/image";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { productFinishes } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";

/** Photos for a finish: finish-specific ones first, then unassigned; all photos if none match. */
export function photosFor(product: Product, finish?: Finish) {
  if (!finish) return product.images;
  const own = product.images.filter((i) => i.finish === finish);
  const shared = product.images.filter((i) => !i.finish);
  const list = [...own, ...shared];
  return list.length ? list : product.images;
}

/**
 * Renders a product image: real photography when the catalogue supplies it,
 * otherwise the art-directed vector placeholder.
 */
export function ProductMedia({
  product,
  finish,
  view = 0,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
  className,
  tone,
}: {
  product: Product;
  finish?: Finish;
  view?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  tone?: "ivory" | "stone" | "dark";
}) {
  const f = finish ?? productFinishes(product)[0];
  const photos = photosFor(product, finish);
  const img = photos.length ? photos[view % photos.length] : undefined;
  return (
    <div
      className={clsx(
        // `relative` would override a caller's `absolute` (same specificity, later in the cascade)
        !/(^|\s)(absolute|fixed)(\s|$)/.test(className ?? "") && "relative",
        "overflow-hidden bg-paper",
        className,
      )}
    >
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: img.focus ?? "50% 40%" }}
        />
      ) : (
        <JewelArt
          form={product.art}
          finish={f}
          view={view}
          tone={tone}
          title={`${product.name} in ${f.replace("-", " ")} — illustration`}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
