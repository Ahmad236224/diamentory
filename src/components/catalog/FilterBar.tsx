"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { CATEGORIES, SORT_OPTIONS, type CategorySlug, type Finish, type SortKey } from "@/lib/catalog";
import { Dialog } from "@/components/ui/Dialog";
import { IconChevron, IconClose, IconFilter } from "@/components/ui/icons";
import { FINISH_SWATCH } from "@/components/product/finishStyle";
import {
  appliedCount,
  CLEARED,
  finishFacets,
  listingHref,
  runListing,
  styleFacets,
  toggle,
  type ListingConfig,
  type ListingState,
} from "./listingState";
import { FilterLink, useListingNav } from "./ListingFrame";

const chip =
  "relative inline-flex min-h-11 shrink-0 items-center gap-2 border px-3.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-[var(--dur-1)]";
const chipOn = "border-obsidian bg-obsidian text-ivory";
const chipOff = "border-obsidian/15 hover:border-obsidian/60";

function Swatch({ f }: { f: Finish }) {
  return (
    <span
      aria-hidden="true"
      className="size-3 shrink-0 rounded-full ring-1 ring-current/25"
      style={{ background: FINISH_SWATCH[f] }}
    />
  );
}

function Count({ n }: { n: number }) {
  return (
    <span className="text-[0.6875rem] tabular-nums opacity-55">
      {n}
      <span className="sr-only"> pieces</span>
    </span>
  );
}

const catCount = (config: ListingConfig, state: ListingState, slug: CategorySlug | undefined) =>
  runListing(config, { ...state, category: slug, style: undefined }).length;

export function FilterBar({ config, state, total }: { config: ListingConfig; state: ListingState; total: number }) {
  const [open, setOpen] = useState(false);
  const { go } = useListingNav();
  const applied = appliedCount(state);
  const sortId = useId();
  const showCategory = !!config.allowCategory;
  const styles = styleFacets(config, state);
  const showStyle = styles.length > 1 || !!state.style;
  const finishes = config.allowFinish !== false && !config.finish ? finishFacets(config, state) : [];
  const showFinish = finishes.length > 1 || state.finishes.length > 0;
  const currentSort = state.sort ?? config.defaultSort ?? "featured";
  const noun = total === 1 ? "piece" : "pieces";

  // Mobile quick chips: categories first (shop-all), then the styles inside the chosen scope.
  const quick: "category" | "style" | "finish" | null =
    showCategory && !state.category ? "category" : showStyle ? "style" : showFinish ? "finish" : null;
  const activeCat = state.category ? CATEGORIES.find((c) => c.slug === state.category) : undefined;

  const styleLink = (name: string | undefined) => listingHref(config, state, { style: name });

  return (
    <div className="sticky top-[var(--header-h)] z-30 border-y border-obsidian/10 bg-ivory/95 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/85">
      {/* ── Mobile / tablet ── */}
      <div className="lg:hidden">
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="eyebrow -ml-1 inline-flex min-h-11 items-center gap-2.5 px-1"
          >
            <IconFilter size={18} />
            Filter &amp; sort
            {applied > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-obsidian px-1 text-[0.6875rem] tracking-normal text-ivory tabular-nums">
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
          <nav
            aria-label={
              quick === "category"
                ? "Quick category filter"
                : quick === "style"
                  ? "Quick style filter"
                  : "Quick finish filter"
            }
          >
            <ul className="wrap no-scrollbar flex scroll-px-[var(--gutter)] gap-2 overflow-x-auto pb-3">
              {quick === "category" && (
                <>
                  <li>
                    <FilterLink
                      href={listingHref(config, state, {
                        category: undefined,
                        style: undefined,
                      })}
                      aria-current="true"
                      className={clsx(chip, chipOn)}
                    >
                      All <Count n={catCount(config, state, undefined)} />
                    </FilterLink>
                  </li>
                  {CATEGORIES.map((c) => {
                    const n = catCount(config, state, c.slug);
                    return n > 0 ? (
                      <li key={c.slug}>
                        <FilterLink
                          href={listingHref(config, state, {
                            category: c.slug,
                            style: undefined,
                          })}
                          aria-pressed={false}
                          className={clsx(chip, chipOff)}
                        >
                          {c.shortName} <Count n={n} />
                        </FilterLink>
                      </li>
                    ) : null;
                  })}
                </>
              )}
              {quick === "style" && (
                <>
                  {activeCat ? (
                    <li>
                      <FilterLink
                        href={listingHref(config, state, {
                          category: undefined,
                          style: undefined,
                        })}
                        className={clsx(chip, chipOn)}
                        aria-label={`Remove ${activeCat.shortName} filter`}
                      >
                        {activeCat.shortName}
                        <IconClose size={14} />
                      </FilterLink>
                    </li>
                  ) : (
                    <li>
                      <FilterLink
                        href={styleLink(undefined)}
                        aria-current={!state.style ? "true" : undefined}
                        className={clsx(chip, !state.style ? chipOn : chipOff)}
                      >
                        All styles
                      </FilterLink>
                    </li>
                  )}
                  {styles.map((s) => {
                    const on = state.style === s.name;
                    return (
                      <li key={s.slug}>
                        <FilterLink
                          href={styleLink(on ? undefined : s.name)}
                          aria-pressed={on}
                          className={clsx(chip, on ? chipOn : chipOff)}
                        >
                          {s.name} <Count n={s.count} />
                        </FilterLink>
                      </li>
                    );
                  })}
                </>
              )}
              {quick === "finish" &&
                finishes.map((f) => {
                  const on = state.finishes.includes(f.slug);
                  return (
                    <li key={f.slug}>
                      <FilterLink
                        href={listingHref(config, state, {
                          finishes: toggle(state.finishes, f.slug),
                        })}
                        aria-pressed={on}
                        className={clsx(chip, on ? chipOn : chipOff)}
                      >
                        <Swatch f={f.slug} />
                        {f.name}
                      </FilterLink>
                    </li>
                  );
                })}
              <li aria-hidden="true" className="w-1 shrink-0" />
            </ul>
          </nav>
        )}
      </div>

      {/* ── Desktop ── */}
      <div className="wrap hidden items-start gap-x-10 py-3 lg:flex">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-8 gap-y-3">
          {showCategory && (
            <div role="group" aria-label="Category" className="flex items-center gap-2">
              <span className="eyebrow mr-1 text-stone">Category</span>
              {CATEGORIES.map((c) => {
                const on = state.category === c.slug;
                const n = catCount(config, state, c.slug);
                if (!on && n === 0) return null;
                return (
                  <FilterLink
                    key={c.slug}
                    href={listingHref(config, state, {
                      category: on ? undefined : c.slug,
                      style: undefined,
                    })}
                    aria-pressed={on}
                    className={clsx(chip, "min-h-10", on ? chipOn : chipOff)}
                  >
                    {c.shortName} <Count n={n} />
                  </FilterLink>
                );
              })}
            </div>
          )}
          {showStyle && (
            <div role="group" aria-label="Style" className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1 text-stone">Style</span>
              {styles.map((s) => {
                const on = state.style === s.name;
                return (
                  <FilterLink
                    key={s.slug}
                    href={styleLink(on ? undefined : s.name)}
                    aria-pressed={on}
                    className={clsx(chip, "min-h-10", on ? chipOn : chipOff)}
                  >
                    {s.name} <Count n={s.count} />
                  </FilterLink>
                );
              })}
            </div>
          )}
          {showFinish && (
            <div role="group" aria-label="Finish" className="flex items-center gap-2">
              <span className="eyebrow mr-1 text-stone">Finish</span>
              {finishes.map((f) => {
                const on = state.finishes.includes(f.slug);
                return (
                  <FilterLink
                    key={f.slug}
                    href={listingHref(config, state, {
                      finishes: toggle(state.finishes, f.slug),
                    })}
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
              href={listingHref(config, state, CLEARED)}
              className="eyebrow link-line inline-flex min-h-10 items-center text-stone"
            >
              Clear all
            </FilterLink>
          )}
        </div>
        <div className="flex min-h-10 shrink-0 items-center gap-6">
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
              onChange={(e) =>
                go(
                  listingHref(config, state, {
                    sort: e.target.value as SortKey,
                  }),
                )
              }
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
  onApply,
}: {
  config: ListingConfig;
  state: ListingState;
  onApply: (href: string) => void;
}) {
  const uid = useId();
  const [finishes, setFinishes] = useState<Finish[]>(state.finishes);
  const [category, setCategory] = useState<CategorySlug | undefined>(state.category);
  const [style, setStyle] = useState<string | undefined>(state.style);
  const [inStock, setInStock] = useState(state.inStock);
  const [sort, setSort] = useState<SortKey>(state.sort ?? config.defaultSort ?? "featured");

  const draft: ListingState = {
    ...state,
    finishes,
    category,
    style,
    inStock,
    sort,
  };
  const count = runListing(config, draft).length;
  const facet = (patch: Partial<ListingState>) => runListing(config, { ...draft, ...patch }).length;
  const draftApplied = appliedCount(draft);
  const showCategory = !!config.allowCategory;
  const styles = styleFacets(config, draft);
  const finishOpts = config.allowFinish !== false && !config.finish ? finishFacets(config, draft) : [];

  const row =
    "flex min-h-12 cursor-pointer items-center justify-between gap-4 border-b border-obsidian/10 text-[0.9375rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2";
  const num = "text-[0.8125rem] text-stone tabular-nums";

  return (
    <>
      <div className="wrap flex-1 overflow-y-auto overscroll-contain pb-4">
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

        {showCategory && (
          <fieldset className="mt-8">
            <legend className="eyebrow text-stone">Category</legend>
            <div className="mt-2">
              {[undefined, ...CATEGORIES.map((c) => c.slug)].map((slug) => {
                const c = CATEGORIES.find((x) => x.slug === slug);
                const n = facet({ category: slug, style: undefined });
                if (slug && n === 0 && category !== slug) return null;
                return (
                  <label key={slug ?? "all"} className={row}>
                    <span>
                      {c ? c.name : "All categories"} <span className={num}>({n})</span>
                    </span>
                    <input
                      type="radio"
                      name={`${uid}-cat`}
                      checked={category === slug}
                      onChange={() => {
                        setCategory(slug);
                        setStyle(undefined);
                      }}
                      className="size-4 accent-obsidian"
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {(styles.length > 1 || style) && (
          <fieldset className="mt-8">
            <legend className="eyebrow text-stone">Style</legend>
            <div className="mt-2">
              <label className={row}>
                <span>
                  All styles <span className={num}>({facet({ style: undefined })})</span>
                </span>
                <input
                  type="radio"
                  name={`${uid}-style`}
                  checked={!style}
                  onChange={() => setStyle(undefined)}
                  className="size-4 accent-obsidian"
                />
              </label>
              {styles.map((s) => (
                <label key={s.slug} className={row}>
                  <span>
                    {s.name} <span className={num}>({s.count})</span>
                  </span>
                  <input
                    type="radio"
                    name={`${uid}-style`}
                    checked={style === s.name}
                    onChange={() => setStyle(s.name)}
                    className="size-4 accent-obsidian"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {finishOpts.length > 1 && (
          <fieldset className="mt-8">
            <legend className="eyebrow text-stone">Finish</legend>
            <div className="mt-2">
              {finishOpts.map((f) => {
                const on = finishes.includes(f.slug);
                const n = facet({
                  finishes: on ? finishes : [...finishes, f.slug],
                });
                return (
                  <label key={f.slug} className={clsx(row, !on && n === 0 && "text-stone")}>
                    <span className="flex items-center gap-3">
                      <Swatch f={f.slug} />
                      {f.name}
                      <span className={num}>({n})</span>
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

      <div className="wrap safe-bottom flex shrink-0 gap-2 border-t border-obsidian/10 bg-ivory pt-3">
        <button
          type="button"
          disabled={draftApplied === 0}
          onClick={() => {
            setFinishes([]);
            setCategory(undefined);
            setStyle(undefined);
            setInStock(false);
          }}
          className="btn btn-outline flex-1 border-obsidian/20 disabled:opacity-40"
        >
          Clear{draftApplied > 0 ? ` (${draftApplied})` : ""}
        </button>
        <button
          type="button"
          onClick={() =>
            onApply(
              listingHref(config, state, {
                finishes,
                category,
                style,
                inStock,
                sort,
              }),
            )
          }
          className="btn btn-dark flex-[2]"
        >
          {`Show ${count} ${count === 1 ? "piece" : "pieces"}`}
        </button>
      </div>
    </>
  );
}
