import { USING_FIXTURES } from "@/lib/catalog";

/** Visible while the storefront runs on development sample data. */
export function FixtureNotice() {
  if (!USING_FIXTURES) return null;
  return (
    <p className="fixture-notice flex h-[var(--notice-h)] items-center justify-center overflow-hidden bg-obsidian px-4 text-center text-[0.6875rem] whitespace-nowrap tracking-[0.12em] text-champagne uppercase">
      Preview · sample products &amp; prices<span className="hidden sm:inline"> · Ordering opens soon</span>
    </p>
  );
}
