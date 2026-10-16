import { USING_FIXTURES } from "@/lib/catalog";

/** Visible while the storefront runs on development sample data. */
export function FixtureNotice() {
  if (!USING_FIXTURES) return null;
  return (
    <p className="bg-obsidian px-4 py-2 text-center text-[0.6875rem] tracking-[0.12em] text-champagne uppercase">
      Preview · sample products &amp; prices<span className="hidden sm:inline"> · Ordering opens soon</span>
    </p>
  );
}
