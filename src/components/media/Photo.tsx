import Image from "next/image";
import clsx from "clsx";
import { getImage } from "@/content/images";

/**
 * Manifest-driven photograph. Always fills its (aspect-reserved) parent, so there is no CLS.
 * `position` is the object-position focal point — always set it so jewellery is never cropped.
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
  dark,
}: {
  id: string;
  sizes: string;
  /** Above-the-fold image: preloaded (Next 16 `preload`, replaces the deprecated `priority`). */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  position?: string;
  mono?: boolean;
  /** Override the manifest alt (e.g. "" when purely decorative next to a caption). */
  alt?: string;
  /** Placeholder tone while loading: dark sections use graphite instead of paper. */
  dark?: boolean;
}) {
  const img = getImage(id);
  return (
    <div
      className={clsx(
        // don't fight a caller's `absolute`/`fixed` (same specificity, cascade order decides)
        !/(^|\s)(absolute|fixed)(\s|$)/.test(className ?? "") && "relative",
        "overflow-hidden",
        dark ? "bg-graphite" : "bg-paper",
        className,
      )}
    >
      <Image
        src={img.src}
        alt={alt ?? img.alt}
        fill
        sizes={sizes}
        preload={priority}
        className={clsx("object-cover", mono && "grayscale contrast-[1.06]", imgClassName)}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
