import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { RingsSection } from "@/components/home/RingsSection";
import { ChainsSection } from "@/components/home/ChainsSection";
import { BraceletsSection } from "@/components/home/BraceletsSection";
import { TheEdit } from "@/components/home/TheEdit";
import { StorySection } from "@/components/home/StorySection";

export const metadata: Metadata = {
  title: { absolute: "DIAMENTORY — Not Made to Blend In" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { images: SITE.ogImages,
    title: "DIAMENTORY — Not Made to Blend In",
    description: "Statement rings, chains & lockets and bracelets. Shipping all over Pakistan.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <RingsSection />
      <ChainsSection />
      <BraceletsSection />
      <TheEdit />
      <StorySection />
    </>
  );
}
