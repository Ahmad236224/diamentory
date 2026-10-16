import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/content/site";
import { EditorialPage, Section } from "@/components/content/EditorialPage";
import { Pending, PendingNote } from "@/components/content/Pending";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the Diamentory website and ordering from Diamentory. Draft pending review.",
  alternates: { canonical: "/terms" },
};

const TOC = [
  { id: "intro", label: "Introduction" },
  { id: "preview", label: "This preview" },
  { id: "products", label: "Products & imagery" },
  { id: "prices", label: "Prices" },
  { id: "orders", label: "Orders" },
  { id: "payment", label: "Payment" },
  { id: "delivery", label: "Delivery & returns" },
  { id: "ip", label: "Intellectual property" },
  { id: "liability", label: "Liability" },
  { id: "law", label: "Governing law" },
  { id: "contact", label: "Contact" },
];

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Legal"
      draft
      title={
        <>
          Terms <em>&amp; conditions</em>
        </>
      }
      intro="A working draft of the terms for using this website and ordering from Diamentory. It has not yet been reviewed and will be finalised before online ordering opens."
      toc={TOC}
    >
      <p className="text-sm text-stone">
        Last updated: <Pending />
      </p>

      <Section id="intro" title="Introduction">
        <p>
          These terms apply when you use the Diamentory website. By using the site you agree to them. If you do not
          agree, please do not use the site.
        </p>
        <PendingNote>The legal name and registered details of the business operating this website.</PendingNote>
      </Section>

      <Section id="preview" title="This preview">
        <p>
          The website is currently a preview. Products, prices, stock levels and images shown are samples, and online
          ordering is not yet open: completing checkout does not place an order or take a payment.
        </p>
      </Section>

      <Section id="products" title="Products & imagery">
        <p>
          We aim to describe and illustrate every piece accurately. Product images are currently illustrations, not
          photographs; colours and proportions may differ from the finished piece.
        </p>
        <PendingNote>Material, finish and sizing descriptions for each piece, once verified.</PendingNote>
      </Section>

      <Section id="prices" title="Prices">
        <p>
          Prices are shown in Pakistani rupees (PKR). Delivery charges are shown separately at checkout. Prices may
          change; if a price changes after you add a piece to your bag, your bag shows the update before checkout.
        </p>
      </Section>

      <Section id="orders" title="Orders">
        <PendingNote>
          When an order becomes a binding contract, how orders are confirmed, and the circumstances in which Diamentory
          may decline or cancel an order (for example, stock or pricing errors).
        </PendingNote>
      </Section>

      <Section id="payment" title="Payment">
        <p>
          Checkout offers cash on delivery and bank transfer. For bank transfer, account details are shared after your
          order is confirmed. Online card payment is not yet available.
        </p>
        <PendingNote>Payment deadlines for bank transfer, and any cash-on-delivery conditions.</PendingNote>
      </Section>

      <Section id="delivery" title="Delivery & returns">
        <p>
          Delivery is covered on our <Link href="/shipping">Shipping &amp; Delivery</Link> page, and returns on our{" "}
          <Link href="/returns">Returns &amp; Exchanges</Link> page. Both form part of these terms once finalised.
        </p>
      </Section>

      <Section id="ip" title="Intellectual property">
        <p>
          The Diamentory name, designs, text, illustrations and layout of this website belong to Diamentory and may not be
          copied or reused without permission.
        </p>
      </Section>

      <Section id="liability" title="Liability">
        <PendingNote>Limitation of liability and warranty terms, subject to legal review.</PendingNote>
      </Section>

      <Section id="law" title="Governing law">
        <PendingNote>Governing law and jurisdiction (expected to be Pakistan), subject to legal review.</PendingNote>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          Questions about these terms? Message us on{" "}
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            Instagram<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          at {SITE.instagramHandle}.
        </p>
      </Section>
    </EditorialPage>
  );
}
