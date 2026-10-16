import { IconChevron } from "@/components/ui/icons";
import { HelpBand } from "./HelpBand";

export type TocItem = { id: string; label: string };

/** Shared editorial shell for client-care and legal pages. */
export function EditorialPage({
  eyebrow,
  title,
  intro,
  draft,
  toc,
  aside,
  children,
  help = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Legal pages: label clearly as a draft pending review. */
  draft?: boolean;
  toc?: TocItem[];
  aside?: React.ReactNode;
  children: React.ReactNode;
  help?: boolean;
}) {
  return (
    <>
      <article>
        <header className="gutter mx-auto max-w-[1800px] border-b border-obsidian/10 pt-12 pb-10 sm:pt-16 lg:pt-24 lg:pb-16">
          <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
            <p className="eyebrow text-stone lg:col-span-3 lg:pt-4">{eyebrow}</p>
            <div className="lg:col-span-9">
              <h1 className="display text-[clamp(2.9rem,12vw,8rem)]">{title}</h1>
              {draft && (
                <p className="mt-7 inline-flex items-center gap-3 border border-obsidian px-3 py-2">
                  <span className="eyebrow">Draft — pending review</span>
                </p>
              )}
              {intro && <div className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-graphite">{intro}</div>}
            </div>
          </div>
        </header>

        <div className="gutter mx-auto grid max-w-[1800px] gap-y-10 pt-8 pb-20 lg:grid-cols-12 lg:gap-x-8 lg:pt-16 lg:pb-28">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              {toc && toc.length > 0 && (
                <>
                  <details className="group border-y border-obsidian/10 lg:hidden">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                      <span className="eyebrow">On this page</span>
                      <IconChevron dir="down" size={16} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <TocList toc={toc} />
                  </details>
                  <nav aria-label="On this page" className="hidden lg:block">
                    <p className="eyebrow text-stone">On this page</p>
                    <TocList toc={toc} />
                  </nav>
                </>
              )}
              {aside && <div className="mt-8 hidden lg:block">{aside}</div>}
            </div>
          </div>
          <div className="prose-legal min-w-0 lg:col-span-8 lg:col-start-5">{children}</div>
        </div>
      </article>
      {help && <HelpBand />}
    </>
  );
}

function TocList({ toc }: { toc: TocItem[] }) {
  return (
    <ol className="pb-3 lg:mt-4 lg:pb-0">
      {toc.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="group/t flex min-h-11 items-baseline gap-3 py-1.5 text-sm text-graphite hover:text-obsidian lg:min-h-9">
            <span className="w-5 shrink-0 text-[0.6875rem] tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
            <span className="link-line">{t.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** A numbered section with an anchor id for the table of contents. */
export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-[calc(var(--header-h)+1.5rem)]">
      <h2 id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  );
}

/** Hairline key-facts table — values fall back to the Pending treatment. */
export function Facts({ items, caption }: { items: { label: string; value: React.ReactNode }[]; caption?: string }) {
  return (
    <div className="not-prose mb-4 max-w-[64ch]">
      {caption && <p className="eyebrow mb-3 text-stone">{caption}</p>}
      <dl className="border-t border-obsidian/10">
        {items.map((it) => (
          <div key={it.label} className="grid grid-cols-1 gap-1 border-b border-obsidian/10 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <dt className="text-sm text-stone">{it.label}</dt>
            <dd className="text-[0.95rem] text-obsidian">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
