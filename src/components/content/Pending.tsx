import clsx from "clsx";

const DEFAULT = "To be confirmed by Diamentory";

/**
 * Visible placeholder for any business fact Diamentory has not confirmed yet
 * (fees, timelines, return window, courier, refund method…). Never replace with a guess.
 */
export function Pending({ children = DEFAULT, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "pending-chip inline-flex items-center gap-1.5 border border-dashed border-obsidian/35 px-1.5 py-px align-baseline text-[max(0.8125em,11px)] leading-snug text-graphite",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 border border-current" />
      {children}
    </span>
  );
}

/** Block-level note for a whole policy clause awaiting confirmation. */
export function PendingNote({ title = DEFAULT, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="pending-note my-5 max-w-[64ch] border border-dashed border-obsidian/30 px-4 py-4 sm:px-5">
      <p className="eyebrow flex items-center gap-2 text-graphite">
        <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 border border-current" />
        {title}
      </p>
      {children && <div className="mt-2 text-sm leading-relaxed text-stone">{children}</div>}
    </div>
  );
}

/** Shows a confirmed value, or the Pending treatment when the value is still null. */
export function PendingValue<T>({
  value,
  format = (v: T) => String(v),
}: {
  value: T | null;
  format?: (v: T) => React.ReactNode;
}) {
  return value == null ? <Pending /> : <>{format(value)}</>;
}
