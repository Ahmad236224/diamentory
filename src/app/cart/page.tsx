import type { Metadata } from "next";
import { CartPage } from "@/components/checkout/CartPage";
import { BagCount } from "@/components/checkout/BagCount";
import { PageHeader } from "@/components/catalog/CatalogHeader";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your Diamentory bag before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Shopping bag" title="Your" accent="bag">
        <div className="mt-5 min-h-6">
          <BagCount />
        </div>
      </PageHeader>
      <CartPage />
    </>
  );
}
