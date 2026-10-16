import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { CubanSection } from "@/components/home/CubanSection";
import { TennisSection } from "@/components/home/TennisSection";
import { BraceletsSection } from "@/components/home/BraceletsSection";
import { RingsSection } from "@/components/home/RingsSection";
import { PendantsSection } from "@/components/home/PendantsSection";
import { SetsSection } from "@/components/home/SetsSection";
import { TheEdit } from "@/components/home/TheEdit";
import { BrandStatement } from "@/components/home/BrandStatement";

export const metadata: Metadata = {
  title: { absolute: "DIAMENTORY — Not Made to Blend In" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "DIAMENTORY — Not Made to Blend In",
    description: "Statement chains, bracelets, rings and pendants. Shipping all over Pakistan.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CubanSection />
      <TennisSection />
      <BraceletsSection />
      <RingsSection />
      <PendantsSection />
      <SetsSection />
      <TheEdit />
      <BrandStatement />
    </>
  );
}
