import Link from "next/link";
import { queryProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

/** 06 — New arrivals: `isNew` products, newest first, on a numbered rail. */
export function NewArrivals() {
  const items = queryProducts({ newOnly: true, sort: "newest" });
  if (!items.length) return null;
  const total = String(items.length).padStart(2, "0");

  return (
    <section aria-labelledby="new-title" className="bg-champagne/35 py-20 lg:py-32">
      <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pl-[var(--gutter)]">
        <div className="px-[var(--gutter)] lg:col-span-3 lg:flex lg:flex-col lg:justify-between lg:px-0 lg:pb-16">
          <div>
            <p className="eyebrow flex items-center gap-3 text-stone">
              <span className="tabular-nums">06</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              <span>New arrivals</span>
            </p>
            <h2 id="new-title" className="display mt-4 text-[clamp(2.25rem,9vw,5.25rem)]">
              Just <em className="italic">in.</em>
            </h2>
            <p className="mt-4 max-w-[30ch] text-[0.9rem] leading-relaxed text-graphite">
              The latest additions, newest first.
            </p>
          </div>
          <Link
            href="/new-arrivals"
            className="eyebrow mt-6 inline-flex min-h-12 items-center justify-center border border-obsidian px-7 transition-colors hover:bg-obsidian hover:text-ivory lg:self-start"
          >
            Shop new arrivals
          </Link>
        </div>

        <ol
          aria-label="New arrivals, newest first"
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-[var(--gutter)] px-[var(--gutter)] lg:col-span-9 lg:mt-0 lg:gap-6 lg:pl-0"
        >
          {items.map((p, i) => (
            <li key={p.slug} className={`w-[58vw] max-w-[320px] shrink-0 snap-start lg:w-[22vw] ${i % 2 ? "lg:mt-16" : ""}`}>
              <p className="eyebrow mb-3 flex justify-between text-stone tabular-nums" aria-hidden="true">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>/ {total}</span>
              </p>
              <ProductCard product={p} sizes="(min-width:1024px) 22vw, 58vw" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
