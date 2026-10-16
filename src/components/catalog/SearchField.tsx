"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import { IconSearch } from "@/components/ui/icons";

/** Search box for /search. Works as a plain GET form without JS. Needs a <Suspense> boundary. */
export function SearchField() {
  const sp = useSearchParams();
  return <SearchForm key={sp.get("q") ?? ""} initial={sp.get("q") ?? ""} />;
}

export function SearchForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const id = useId();
  return (
    <form
      role="search"
      action="/search"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      }}
      className="flex items-center gap-3 border-b border-obsidian pb-2"
    >
      <label htmlFor={id} className="sr-only">
        Search the collection
      </label>
      <IconSearch className="shrink-0" size={22} />
      <input
        id={id}
        name="q"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        defaultValue={initial}
        placeholder="Chains, rings, gold…"
        className="h-14 min-w-0 flex-1 bg-transparent font-serif text-3xl outline-none placeholder:text-stone/70 sm:text-4xl"
      />
      <button type="submit" className="eyebrow min-h-11 shrink-0 px-2">
        Search
      </button>
    </form>
  );
}
