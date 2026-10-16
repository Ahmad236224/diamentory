import type { NextConfig } from "next";
import { RETIRED_PRODUCT_REDIRECTS } from "./src/lib/catalog/fixtures";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Three-category structure: old category + retired sample-product URLs redirect permanently.
  async redirects() {
    return [
      { source: "/shop/pendants", destination: "/shop/chains?style=locket", permanent: true },
      { source: "/shop/sets", destination: "/shop", permanent: true },
      ...Object.entries(RETIRED_PRODUCT_REDIRECTS).map(([slug, destination]) => ({
        source: `/product/${slug}`,
        destination,
        permanent: true,
      })),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
