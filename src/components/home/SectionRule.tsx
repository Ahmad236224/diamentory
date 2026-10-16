import clsx from "clsx";

/** Numbered hairline that opens each homepage chapter. */
export function SectionRule({ n, label, aside, tone = "light" }: { n: string; label: string; aside?: string; tone?: "light" | "dark" }) {
  return (
    <div
      className={clsx(
        "reveal flex items-baseline justify-between border-t pt-3",
        tone === "dark" ? "border-ivory/40" : "border-obsidian",
      )}
    >
      <p className="eyebrow">
        {n} — {label}
      </p>
      {aside && <p className={clsx("eyebrow", tone === "dark" ? "text-champagne" : "text-stone")}>{aside}</p>}
    </div>
  );
}
