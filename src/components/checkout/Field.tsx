"use client";

import clsx from "clsx";
import { IconChevron } from "@/components/ui/icons";

type Base = {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  className?: string;
};

const CONTROL =
  "block w-full min-h-12 border bg-transparent px-4 text-base text-obsidian placeholder:text-stone/80 transition-colors focus:border-obsidian focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian read-only:bg-obsidian/[0.03] read-only:text-graphite";

function describedBy(id: string, error?: string, hint?: React.ReactNode) {
  return [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

function Label({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.8125rem] text-graphite">
      <span>{label}</span>
      {optional && <span className="text-xs text-stone">Optional</span>}
    </label>
  );
}

export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex gap-2 text-[0.8125rem] leading-snug text-error">
          <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rotate-45 bg-error" />
          {error}
        </p>
      )}
    </>
  );
}

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  className,
  ...input
}: Base & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">) {
  return (
    <div className={className}>
      <Label id={id} label={label} optional={optional} />
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={optional ? undefined : true}
        className={clsx(CONTROL, error ? "border-error" : "border-obsidian/20 hover:border-obsidian/45")}
        {...input}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({
  id,
  label,
  error,
  hint,
  optional,
  className,
  ...input
}: Base & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
  return (
    <div className={className}>
      <Label id={id} label={label} optional={optional} />
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={clsx(CONTROL, "min-h-28 resize-y py-3 leading-relaxed", error ? "border-error" : "border-obsidian/20 hover:border-obsidian/45")}
        {...input}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  optional,
  className,
  options,
  placeholder,
  ...select
}: Base & { options: string[]; placeholder: string } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id">) {
  return (
    <div className={className}>
      <Label id={id} label={label} optional={optional} />
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={optional ? undefined : true}
          className={clsx(
            CONTROL,
            "appearance-none pr-11",
            !select.value && "text-stone",
            error ? "border-error" : "border-obsidian/20 hover:border-obsidian/45",
          )}
          {...select}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-obsidian">
              {o}
            </option>
          ))}
        </select>
        <IconChevron dir="down" size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
