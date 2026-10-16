"use client";

import { IconMinus, IconPlus } from "./icons";

export function QtyStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex h-11 items-center border border-obsidian/20" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="grid h-full w-11 place-items-center disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <IconMinus size={16} />
      </button>
      <output className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="grid h-full w-11 place-items-center disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus size={16} />
      </button>
    </div>
  );
}
