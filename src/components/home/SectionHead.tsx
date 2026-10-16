import Link from "next/link";
import clsx from "clsx";
import { IconArrow } from "@/components/ui/icons";

/** Hairline opener shared by every homepage chapter: index tag + label, optional shop link. */
export function SectionHead({
  n,
  label,
  href,
  cta,
  tone = "light",
}: {
  n: string;
  label: string;
  href?: string;
  cta?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={clsx(
        "reveal flex min-h-12 items-center justify-between gap-4 border-t",
        tone === "dark" ? "border-ivory/15" : "border-obsidian/10",
      )}
    >
      <p className="eyebrow flex items-center gap-3">
        <span className="tag">{n}</span>
        {label}
      </p>
      {href && cta && (
        <Link href={href} className="eyebrow link-arrow inline-flex min-h-11 items-center gap-2">
          <span className="link-line">{cta}</span> <IconArrow size={14} />
        </Link>
      )}
    </div>
  );
}

/** Caption under an editorial frame: name (underlines with its parent link) + optional note. */
export function FrameCaption({ name, note, tone = "light" }: { name: string; note?: string; tone?: "light" | "dark" }) {
  return (
    <p className="mt-3 flex items-baseline justify-between gap-3">
      <span className="t-small link-line link-group">{name}</span>
      {note && <span className={clsx("eyebrow shrink-0", tone === "dark" ? "text-champagne" : "text-stone")}>{note}</span>}
    </p>
  );
}
