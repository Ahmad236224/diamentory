"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/** Progressive "load more": a real link to the next page size, enhanced to keep scroll position. */
export function LoadMore({ href, shown, total }: { href: string | null; shown: number; total: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const pct = total ? Math.round((shown / total) * 100) : 100;
  return (
    <div className="mx-auto mt-16 flex max-w-xs flex-col items-center text-center lg:mt-24">
      <p className="text-[0.8125rem] text-stone tabular-nums">
        Showing {shown} of {total}
      </p>
      <div className="mt-3 h-px w-full bg-obsidian/10" aria-hidden="true">
        <div className="h-px bg-obsidian transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      {href && (
        <Link
          href={href}
          scroll={false}
          prefetch={false}
          aria-busy={pending || undefined}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            start(() => router.push(href, { scroll: false }));
          }}
          className="eyebrow mt-6 inline-flex min-h-12 w-full items-center justify-center border border-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
        >
          {pending ? "Loading…" : "Load more"}
        </Link>
      )}
    </div>
  );
}
