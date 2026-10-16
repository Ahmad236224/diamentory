import Link from "next/link";
import clsx from "clsx";

/** Editorial section header: index numeral + eyebrow, display title, optional link. */
export function SectionHead({
  index,
  eyebrow,
  title,
  id,
  link,
  className,
  tone = "light",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  id: string;
  link?: { href: string; label: string };
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={clsx("flex flex-wrap items-end justify-between gap-x-8 gap-y-5", className)}>
      <div>
        <p className={clsx("eyebrow flex items-center gap-3", tone === "dark" ? "text-champagne" : "text-stone")}>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className="display mt-4 text-[clamp(2.25rem,9vw,5.25rem)]">
          {title}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="eyebrow link-line inline-flex min-h-11 items-center">
          {link.label}
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
