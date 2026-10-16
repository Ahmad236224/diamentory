"use client";

import { useId, useMemo, useState } from "react";
import clsx from "clsx";
import { CATEGORIES, FINISHES, SORT_OPTIONS, type CategorySlug, type Finish, type SortKey } from "@/lib/catalog";
import { Dialog } from "@/components/ui/Dialog";
import { IconChevron, IconFilter } from "@/components/ui/icons";
import { FINISH_SWATCH } from "@/components/product/useVariantSelection";
import {
  appliedCount,
  listingHref,
  runListing,
  toggle,
  type ListingConfig,
  type ListingState,
} from "./listingState";
import { FilterLink, useListingNav } from "./ListingFrame";

const chip =
  "inline-flex min-h-11 shrink-0 items-center gap-2 border px-3.5 text-[0.8125rem] whitespace-nowrap transition-colors";
const chipOn = "border-obsidian bg-obsidian text-ivory";
const chipOff = "border-obsidian/15 hover:border-obsidian/60";

function Swatch({ f }: { f: Finish }) {
  return <span aria-hidden="true" className="size-3 shrink-0 rounded-full ring-1 ring-current/25" style={{ background: FINISH_SWATCH[f] }} />;
}

export function FilterBar({ config, state, total }: { config: ListingConfig; state: ListingState; total: number }) {
  const [open, setOpen] = useState(false);
  const { go } = useListingNav();
  const applied = appliedCount(state);
  const sortId = useId();
  const showFinish = config.allowFinish !== false && !config.finish;
  const showCategory = !!config.allowCategory;
  const currentSort = state.sort ?? config.defaultSort ?? "featured";
  const noun = total === 1 ? "piece" : "pieces";

  // Quick chips on mobile: finishes, or categories when the finish is fixed.
  const quick = showFinish ? "finish" : showCategory ? "category" : null;

  return (
    <div className="sticky top-[var(--header-h)] z-30 border-y border-obsidian/10 bg-ivory/95 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/85">
      {/* ── Mobile / tablet ── */}
      <div className="lg:hidden">
        <div className="gutter flex h-14 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="-ml-1 inline-flex min-h-11 items-center gap-2.5 px-1 eyebrow"
          >
            <IconFilter size={18} />
            Filter &amp; sort
            {applied > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-obsidian px-1 text-[0.625rem] tracking-normal text-ivory tabular-nums">
                {applied}
                <span className="sr-only"> applied</span>
              </span>
            )}
          </button>
          <p className="text-[0.8125rem] text-stone tabular-nums" aria-live="polite">
            {total} {noun}
          </p>
        </div>
        {quick && (
          <nav aria-label={quick === "finish" ? "Quick finish filter" : "Quick category filter"} className="relative">
            <ul className="no-scrollbar gutter flex gap-2 overflow-x-auto pb-3">
              {quick === "finish" ? (
                <>
                  <li>
                    <FilterLink
                      href={listingHref(config, state, { finishes: [] })}
                      aria-current={state.finishes.length === 0 ? "true" : undefined}
                      className={clsx(chip, state.finishes.length === 0 ? chipOn : chipOff)}
                    >
                      All finishes
                    </FilterLink>
                  </li>
                  {FINISHES.map((f) => {
                    const on = state.finishes.includes(f.slug);
                    return (
                      <li key={f.slug}>
                        <FilterLink
                          href={listingHref(config, state, { finishes: toggle(state.finishes, f.slug) })}
                          aria-pressed={on}
                          className={clsx(chip, on ? chipOn : chipOff)}
                        >
                          <Swatch f={f.slug} />
                          {f.name}
                        </FilterLink>
                      </li>
                    );
                  })}
                </>
              ) : (
                <>
                  <li>
                    <FilterLink
                      href={listingHref(config, state, { category: undefined })}
                      className={clsx(chip, !state.category ? chipOn : chipOff)}
                    >
                      All
                    </FilterLink>
                  </li>
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <FilterLink
                        href={listingHref(config, state, { category: state.category === c.slug ? undefined : c.slug })}
                        aria-pressed={state.category === c.slug}
                        className={clsx(chip, state.category === c.slug ? chipOn : chipOff)}
                      >
                        {c.shortName}
                      </FilterLink>
                    </li>
                  ))}
                </>
              )}
              <li aria-hidden="true" className="w-2 shrink-0" />
            </ul>
          </nav>
        )}
      </div>

      {/* ── Desktop ── */}
      <div className="gutter mx-auto hidden max-w-[1800px] items-center gap-x-8 gap-y-3 py-3 lg:flex lg:flex-wrap">
        {showFinish && (
          <div role="group" aria-label="Finish" className="flex items-center gap-2">
            <span className="eyebrow mr-2 text-stone">Finish</span>
            {FINISHES.map((f) => {
              const on = state.finishes.includes(f.slug);
              return (
                <FilterLink
                  key={f.slug}
                  href={listingHref(config, state, { finishes: toggle(state.finishes, f.slug) })}
                  aria-pressed={on}
                  className={clsx(chip, "min-h-10", on ? chipOn : chipOff)}
                >
                  <Swatch f={f.slug} />
                  {f.name}
                </FilterLink>
              );
            })}
          </div>
        )}
        {showCategory && (
          <div role="group" aria-label="Category" className="flex items-center gap-2">
            <span className="eyebrow mr-2 text-stone">Category</span>
            {CATEGORIES.map((c) => {
              const on = state.category === c.slug;
              return (
                <FilterLink
                  key={c.slug}
                  href={listingHref(config, state, { category: on ? undefined : c.slug })}
                  aria-pressed={on}
                  className={clsx(chip, "min-h-10", on ? chipOn : chipOff)}
                >
                  {c.shortName}
                </FilterLink>
              );
            })}
          </div>
        )}
        <FilterLink
          href={listingHref(config, state, { inStock: !state.inStock })}
          role="switch"
          aria-checked={state.inStock}
          className="inline-flex min-h-10 items-center gap-3 text-[0.8125rem]"
        >
          <span
            aria-hidden="true"
            className={clsx(
              "relative h-5 w-9 rounded-full border transition-colors",
              state.inStock ? "border-obsidian bg-obsidian" : "border-obsidian/30",
            )}
          >
            <span
              className={clsx(
                "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-[left,background] duration-300",
                state.inStock ? "left-[calc(100%-1.0625rem)] bg-ivory" : "left-0.5 bg-obsidian/50",
              )}
            />
          </span>
          In stock only
        </FilterLink>
        {applied > 0 && (
          <FilterLink
            href={listingHref(config, state, { finishes: [], category: undefined, inStock: false })}
            className="eyebrow link-line inline-flex min-h-10 items-center text-stone"
          >
            Clear all
          </FilterLink>
        )}
        <div className="ml-auto flex items-center gap-6">
          <p className="text-[0.8125rem] text-stone tabular-nums" aria-live="polite">
            {total} {noun}
          </p>
          <div className="relative flex items-center">
            <label htmlFor={sortId} className="eyebrow mr-3 text-stone">
              Sort
            </label>
            <select
              id={sortId}
              value={currentSort}
              onChange={(e) => go(listingHref(config, state, { sort: e.target.value as SortKey }))}
              className="min-h-10 cursor-pointer appearance-none border border-obsidian/15 bg-transparent py-2 pr-9 pl-3 text-[0.8125rem] hover:border-obsidian/60"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <IconChevron dir="down" size={14} className="pointer-events-none absolute right-3" />
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} side="bottom" label="Filter and sort" title="Filter & sort">
        {open && (
          <FilterSheet
            config={config}
            state={state}
            showFinish={showFinish}
            showCategory={showCategory}
            onApply={(href) => {
              setOpen(false);
              go(href);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function FilterSheet({
  config,
  state,
  showFinish,
  showCategory,
  onApply,
}: {
  config: ListingConfig;
  state: ListingState;
  showFinish: boolean;
  showCategory: boolean;
  onApply: (href: string) => void;
}) {
  const uid = useId();
  const [finishes, setFinishes] = useState<Finish[]>(state.finishes);
  const [category, setCategory] = useState<CategorySlug | undefined>(state.category);
  const [inStock, setInStock] = useState(state.inStock);
  const [sort, setSort] = useState<SortKey>(state.sort ?? config.defaultSort ?? "featured");

  const draft = { ...state, finishes, category, inStock, sort };
  const count = useMemo(() => runListing(config, draft).length, [config, finishes, category, inStock, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const facet = (patch: Partial<ListingState>) => runListing(config, { ...draft, ...patch }).length;
  const draftApplied = finishes.length + (category ? 1 : 0) + (inStock ? 1 : 0);

  const row =
    "flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-obsidian/10 text-[0.9375rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2";

  return (
    <>
      <div className="gutter flex-1 overflow-y-auto overscroll-contain pb-4">
        <fieldset className="mt-6">
          <legend className="eyebrow text-stone">Sort by</legend>
          <div className="mt-2">
            {SORT_OPTIONS.map((o) => (
              <label key={o.value} className={row}>
                <span>{o.label}</span>
                <input
                  type="radio"
                  name={`${uid}-sort`}
                  checked={sort === o.value}
                  onChange={() => setSort(o.value)}
                  className="size-4 accent-obsidian"
                />
              </label>
            ))}
          </div>
        </fieldset>

        {showFinish && (
          <fieldset className="mt-8">
            <legend className="eyebrow text-stone">Finish</legend>
            <div className="mt-2">
              {FINISHES.map((f) => {
                const on = finishes.includes(f.slug);
                const n = facet({ finishes: on ? finishes : [...finishes, f.slug] });
                return (
                  <label key={f.slug} className={clsx(row, !on && n === 0 && "text-stone")}>
                    <span className="flex items-center gap-3">
                      <Swatch f={f.slug} />
                      {f.name}
                      <span className="text-[0.8125rem] text-stone tabular-nums">({n})</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => setFinishes(toggle(finishes, f.slug))}
                      className="size-4 accent-obsidian"
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {showCategory && (
          <fieldset className="mt-8">
            <legend className="eyebrow text-stone">Category</legend>
            <div className="mt-2">
              {[undefined, ...CATEGORIES.map((c) => c.slug)].map((slug) => {
                const c = CATEGORIES.find((x) => x.slug === slug);
                const n = facet({ category: slug });
                return (
                  <label key={slug ?? "all"} className={clsx(row, n === 0 && category !== slug && "text-stone")}>
                    <span>
                      {c ? c.name : "All categories"}{" "}
                      <span className="text-[0.8125rem] text-stone tabular-nums">({n})</span>
                    </span>
                    <input
                      type="radio"
                      name={`${uid}-cat`}
                      checked={category === slug}
                      onChange={() => setCategory(slug)}
                      className="size-4 accent-obsidian"
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <fieldset className="mt-8">
          <legend className="eyebrow text-stone">Availability</legend>
          <label className={clsx(row, "mt-2")}>
            <span>In stock only</span>
            <input
              type="checkbox"
              role="switch"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="size-4 accent-obsidian"
            />
          </label>
        </fieldset>
      </div>

      <div className="gutter safe-bottom flex shrink-0 gap-2 border-t border-obsidian/10 bg-ivory pt-3">
        <button
          type="button"
          disabled={draftApplied === 0}
          onClick={() => {
            setFinishes([]);
            setCategory(undefined);
            setInStock(false);
          }}
          className="eyebrow min-h-12 flex-1 border border-obsidian/20 disabled:opacity-40"
        >
          Clear{draftApplied > 0 ? ` (${draftApplied})` : ""}
        </button>
        <button
          type="button"
          onClick={() => onApply(listingHref(config, state, { finishes, category, inStock, sort }))}
          className="eyebrow min-h-12 flex-[2] bg-obsidian text-ivory"
        >
          {`Show ${count} ${count === 1 ? "piece" : "pieces"}`}
        </button>
      </div>
    </>
  );
}
