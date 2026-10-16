import { NextResponse, type NextRequest } from "next/server";
import { FIXTURE_PRODUCTS } from "@/lib/catalog/fixtures";

/**
 * Real 404s for unknown catalogue URLs.
 * Dynamic pages render inside <Suspense> (Cache Components + Partial Prefetching), so a notFound()
 * thrown there arrives after the 200 status has been sent. Rejecting unknown slugs here keeps the
 * status code honest. The catalogue is static for now; when it moves to the database this check
 * must read the same source (see the admin-backend branch).
 */
const PRODUCTS = new Set(FIXTURE_PRODUCTS.map((p) => p.slug));
const CATEGORIES = new Set(FIXTURE_PRODUCTS.map((p) => p.category));
const FINISHES = new Set(FIXTURE_PRODUCTS.flatMap((p) => p.variants.map((v) => v.finish)));

export function proxy(req: NextRequest) {
  const [, section, slug, extra] = req.nextUrl.pathname.split("/");
  const known =
    (section === "product" && PRODUCTS.has(slug)) ||
    (section === "shop" && CATEGORIES.has(slug as never)) ||
    (section === "collections" && FINISHES.has(slug as never));
  if (!known || extra !== undefined) {
    return NextResponse.rewrite(new URL("/__not-found", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:slug*", "/shop/:slug+", "/collections/:slug+"],
};
