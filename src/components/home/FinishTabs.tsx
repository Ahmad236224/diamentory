"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import type { Finish } from "@/lib/catalog/types";
import { FINISH_SWATCH } from "@/components/product/useVariantSelection";

/**
 * Accessible tablist (WAI-ARIA tabs, automatic activation).
 * Panels are server-rendered and passed in; this only toggles visibility.
 */
export function FinishTabs({
  tabs,
  panels,
  label,
}: {
  tabs: { id: Finish; label: string }[];
  panels: React.ReactNode[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function focus(i: number) {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), focus(i + 1));
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), focus(i - 1));
    else if (e.key === "Home") (e.preventDefault(), focus(0));
    else if (e.key === "End") (e.preventDefault(), focus(tabs.length - 1));
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="no-scrollbar -mx-[var(--gutter)] flex overflow-x-auto border-b border-obsidian/10 px-[var(--gutter)] lg:mx-0 lg:px-0">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx(
              "relative flex min-h-12 shrink-0 items-center gap-2.5 pr-6 pl-0 transition-colors sm:pr-10",
              active === i ? "text-obsidian" : "text-stone hover:text-obsidian",
            )}
          >
            <span aria-hidden="true" className="size-2.5 rounded-full ring-1 ring-obsidian/20" style={{ background: FINISH_SWATCH[t.id] }} />
            <span className={clsx("font-serif text-[1.35rem] sm:text-[1.6rem]", active === i && "italic")}>{t.label}</span>
            <span
              aria-hidden="true"
              className={clsx(
                "absolute bottom-[-1px] left-0 h-px bg-obsidian transition-[width] duration-500 ease-[var(--ease-out)]",
                active === i ? "w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)]" : "w-0",
              )}
            />
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={tabs[i].id}
          id={`panel-${tabs[i].id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tabs[i].id}`}
          tabIndex={0}
          hidden={active !== i}
          className="fade-in focus-visible:outline-offset-8"
        >
          {p}
        </div>
      ))}
    </div>
  );
}
