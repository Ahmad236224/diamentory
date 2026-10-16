import Image from "next/image";
import clsx from "clsx";
import { getImage } from "@/content/images";

/**
 * Manifest-driven photograph. Always fills its (aspect-reserved) parent, so there is no CLS.
 * `mono` desaturates warm/colour frames into the black-and-white system.
 */
export function Photo({
  id,
  sizes,
  priority,
  className,
  imgClassName,
  position = "center",
  mono,
  alt,
}: {
  id: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  position?: string;
  mono?: boolean;
  /** Override the manifest alt (e.g. "" when purely decorative next to a caption). */
  alt?: string;
}) {
  const img = getImage(id);
  return (
    <div
      className={clsx(
        // don't fight a caller's `absolute`/`fixed` (same specificity, cascade order decides)
        !/(^|\s)(absolute|fixed)(\s|$)/.test(className ?? "") && "relative",
        "overflow-hidden bg-obsidian",
        className,
      )}
    >
      <Image
        src={img.src}
        alt={alt ?? img.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={clsx(
          "object-cover",
          mono && "grayscale contrast-[1.08] transition-[filter] duration-700 [@media(hover:hover)]:group-hover:grayscale-0",
          imgClassName,
        )}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
