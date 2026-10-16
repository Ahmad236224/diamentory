import Image from "next/image";
import clsx from "clsx";
import type { Finish, Product } from "@/lib/catalog/types";
import { productFinishes } from "@/lib/catalog";
import { JewelArt } from "@/components/art/JewelArt";

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
  const img = product.images[view];
  const f = finish ?? productFinishes(product)[0];
  return (
    <div
      className={clsx(
        // `relative` would override a caller's `absolute` (same specificity, later in the cascade)
        !/(^|\s)(absolute|fixed)(\s|$)/.test(className ?? "") && "relative",
        "overflow-hidden bg-[#e9e4dc]",
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
