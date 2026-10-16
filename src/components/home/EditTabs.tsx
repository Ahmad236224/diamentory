"use client";

import { useId, useRef, useState } from "react";
import clsx from "clsx";

/** Accessible tablist; panels are server-rendered and passed in as children. */
export function EditTabs({ labels, children }: { labels: string[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: React.KeyboardEvent, i: number) {
    const last = labels.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1) :
      e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) :
      e.key === "Home" ? 0 :
      e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="Shop by category" className="no-scrollbar -mx-[var(--gutter)] flex gap-1 overflow-x-auto px-[var(--gutter)]">
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`${uid}-t${i}`}
            aria-controls={`${uid}-p${i}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx(
              "eyebrow min-h-11 shrink-0 border px-4 transition-colors",
              i === active ? "border-obsidian bg-obsidian text-ivory" : "border-obsidian/20 hover:border-obsidian",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div key={i} role="tabpanel" id={`${uid}-p${i}`} aria-labelledby={`${uid}-t${i}`} hidden={i !== active} className="mt-6">
          {panel}
        </div>
      ))}
    </>
  );
}
