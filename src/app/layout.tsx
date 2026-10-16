import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SITE } from "@/content/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FixtureNotice } from "@/components/layout/FixtureNotice";
import "./globals.css";

// Display: Unbounded — headlines, collection titles, wordmark.
const display = Unbounded({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

// Interface, product information and checkout.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "DIAMENTORY — Wear Your Distinction",
    template: "%s — DIAMENTORY",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK" className={`${display.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-obsidian focus:px-4 focus:py-3 focus:text-ivory"
        >
          Skip to content
        </a>
        <RevealObserver />
        <CartProvider>
          <FixtureNotice />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
