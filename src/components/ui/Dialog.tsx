"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { IconClose } from "./icons";

type Side = "left" | "right" | "bottom" | "top" | "center";

const PANEL: Record<Side, string> = {
  left: "dlg-left mr-auto h-dvh max-h-dvh w-full max-w-[min(100vw,30rem)]",
  right: "dlg-right ml-auto h-dvh max-h-dvh w-full max-w-[min(100vw,28rem)]",
  bottom: "dlg-bottom mt-auto w-full max-w-full max-h-[88dvh] md:mb-auto md:max-w-xl md:mx-auto md:max-h-[80dvh]",
  top: "dlg-top mb-auto w-full max-w-full",
  center: "dlg-center m-auto w-[calc(100%-2rem)] max-w-5xl max-h-[90dvh]",
};

export function Dialog({
  open,
  onClose,
  side = "right",
  label,
  title,
  hideTitle,
  children,
  className,
  tone = "ivory",
}: {
  open: boolean;
  onClose: () => void;
  side?: Side;
  label: string;
  title?: React.ReactNode;
  hideTitle?: boolean;
  children: React.ReactNode;
  className?: string;
  tone?: "ivory" | "dark";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={clsx(
        "dlg fixed inset-0 m-0 flex-col overflow-hidden p-0 backdrop:bg-obsidian/55 open:flex",
        tone === "dark" ? "bg-obsidian text-ivory" : "bg-ivory text-obsidian",
        PANEL[side],
        className,
      )}
    >
      {open && (
        <>
          {!hideTitle && (
            <div className="flex min-h-[var(--header-h)] shrink-0 items-center justify-between gap-4 border-b border-current/10 gutter">
              <h2 className="eyebrow">{title ?? label}</h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-3 grid size-11 place-items-center"
                aria-label={`Close ${label.toLowerCase()}`}
              >
                <IconClose />
              </button>
            </div>
          )}
          {children}
        </>
      )}
    </dialog>
  );
}
