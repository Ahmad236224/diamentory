import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";
import { PageHeader } from "@/components/catalog/CatalogHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest checkout for Diamentory — contact, delivery and payment details.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

/*
 * Order confirmation (/checkout/confirmation/[orderId]) is intentionally NOT built yet.
 * It arrives with the backend phase: once `submitOrder()` (src/lib/checkout/submit.ts)
 * returns { status: "placed", orderId }, route there and render only server-verified
 * order data (never client state), including bank-transfer instructions.
 */
export default function Page() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/cart", label: "Bag" }, { label: "Checkout" }]}
        eyebrow="Guest checkout"
        title="Checkout"
      />
      <Checkout />
    </>
  );
}
