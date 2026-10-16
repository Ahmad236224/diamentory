import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/Checkout";

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
      <header className="gutter mx-auto max-w-[1800px] pt-10 pb-6 sm:pt-14 lg:pt-20 lg:pb-10">
        <h1 className="display text-[clamp(2.75rem,11vw,6.5rem)]">Checkout</h1>
      </header>
      <Checkout />
    </>
  );
}
