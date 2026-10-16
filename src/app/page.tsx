import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { CategoryEditorial } from "@/components/home/CategoryEditorial";
import { SignatureSelection } from "@/components/home/SignatureSelection";
import { StatementEditorial } from "@/components/home/StatementEditorial";
import { FinishExplorer } from "@/components/home/FinishExplorer";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BrandStory } from "@/components/home/BrandStory";
import { StyledMoments } from "@/components/home/StyledMoments";
import { FinalStatement } from "@/components/home/FinalStatement";

export const metadata: Metadata = {
  title: { absolute: "DIAMENTORY — Wear Your Distinction" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "DIAMENTORY — Wear Your Distinction",
    description: "Statement pieces for those who define their own style.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryEditorial />
      <SignatureSelection />
      <StatementEditorial />
      <FinishExplorer />
      <NewArrivals />
      <BrandStory />
      <StyledMoments />
      <FinalStatement />
    </>
  );
}
