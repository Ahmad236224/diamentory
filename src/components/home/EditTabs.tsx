"use client";

import { useId, useRef, useState } from "react";
import clsx from "clsx";

/** Accessible tablist (arrow keys, Home/End); panels are server-rendered and passed in as children. */
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
      <div
        role="tablist"
        aria-label="Shop by category"
        className="no-scrollbar -mx-[var(--gutter)] flex gap-6 overflow-x-auto border-b border-obsidian/10 px-[var(--gutter)] sm:mx-0 sm:gap-8 sm:px-0"
      >
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-t${i}`}
            aria-controls={`${uid}-p${i}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx(
              "eyebrow relative min-h-12 shrink-0 transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-obsidian after:transition-transform after:duration-[var(--dur-2)] after:ease-[var(--ease-out)]",
              i === active ? "text-obsidian after:scale-x-100" : "text-stone after:scale-x-0 hover:text-obsidian",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${uid}-p${i}`}
          aria-labelledby={`${uid}-t${i}`}
          hidden={i !== active}
          className="tab-panel mt-8"
        >
          {panel}
        </div>
      ))}
    </>
  );
}
