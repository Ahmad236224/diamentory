import type { Metadata } from "next";
import { CartPage } from "@/components/checkout/CartPage";
import { BagCount } from "@/components/checkout/BagCount";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your Diamentory bag before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <header className="gutter mx-auto flex max-w-[1800px] items-end justify-between gap-6 pt-12 pb-8 sm:pt-16 lg:pt-20 lg:pb-12">
        <h1 className="display text-[clamp(3rem,12vw,7.5rem)]">
          Your <em>bag</em>
        </h1>
        <BagCount />
      </header>
      <CartPage />
    </>
  );
}
