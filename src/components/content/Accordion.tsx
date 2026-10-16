import { IconPlus } from "@/components/ui/icons";

export type AccordionItem = { id: string; q: string; a: React.ReactNode };

/** Accessible, JS-free accordion built on native <details>/<summary>. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="border-t border-obsidian/10">
      {items.map((it) => (
        <details key={it.id} id={it.id} className="group scroll-mt-[calc(var(--header-h)+1.5rem)] border-b border-obsidian/10">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.0625rem] leading-snug text-obsidian sm:text-lg">{it.q}</span>
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center border border-obsidian/15 transition-transform duration-500 group-open:rotate-45"
            >
              <IconPlus size={14} />
            </span>
          </summary>
          <div className="faq-answer pb-7 pr-2 sm:pr-14">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
