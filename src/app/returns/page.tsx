import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/content/site";
import { EditorialPage, Facts, Section } from "@/components/content/EditorialPage";
import { Pending, PendingNote, PendingValue } from "@/components/content/Pending";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Diamentory returns and exchanges — return window, eligibility, how to start a return and refunds.",
  alternates: { canonical: "/returns" },
};

const TOC = [
  { id: "overview", label: "At a glance" },
  { id: "eligibility", label: "Eligibility" },
  { id: "exchanges", label: "Exchanges & sizing" },
  { id: "start", label: "Starting a return" },
  { id: "refunds", label: "Refunds" },
  { id: "damaged", label: "Damaged or incorrect items" },
];

export default function Page() {
  const returnWindow = BUSINESS.returnWindowDays.pending ? null : BUSINESS.returnWindowDays.value;
  return (
    <EditorialPage
      eyebrow="Client care"
      title={
        <>
          Returns <em>&amp; exchanges</em>
        </>
      }
      intro="Our returns policy is being finalised. Every term below marked “to be confirmed” will be set by Diamentory and published before online ordering opens — nothing here is a commitment until then."
      toc={TOC}
    >
      <Section id="overview" title="At a glance">
        <Facts
          items={[
            { label: "Return window", value: <PendingValue value={returnWindow} format={(n) => `${n} days from delivery`} /> },
            { label: "Exchanges", value: <Pending /> },
            { label: "Return shipping paid by", value: <Pending /> },
            { label: "Refund method", value: <Pending /> },
            { label: "Refund timeline", value: <Pending /> },
          ]}
        />
      </Section>

      <Section id="eligibility" title="Eligibility">
        <p>Conditions for a return will be listed here — for example, the state a piece must be in and what must be included.</p>
        <PendingNote>Item condition requirements, packaging requirements and any pieces that cannot be returned.</PendingNote>
      </Section>

      <Section id="exchanges" title="Exchanges & sizing">
        <p>
          If you are unsure about a ring size or chain length, message us before ordering — we&rsquo;re happy to help you
          choose.
        </p>
        <PendingNote>Whether size and finish exchanges are offered, and how they work.</PendingNote>
      </Section>

      <Section id="start" title="Starting a return">
        <p>
          To ask about a return or exchange, send us a message on Instagram with your name and order details. We will
          reply with next steps.
        </p>
        <PendingNote>The return process, return address and courier arrangements.</PendingNote>
      </Section>

      <Section id="refunds" title="Refunds">
        <PendingNote>
          How refunds are issued (for example, to a bank account for cash-on-delivery orders), how long they take, and
          whether delivery charges are refunded.
        </PendingNote>
      </Section>

      <Section id="damaged" title="Damaged or incorrect items">
        <p>
          If a piece arrives damaged or isn&rsquo;t what you ordered, message us on Instagram with photos of the item and
          packaging. See also <Link href="/shipping">Shipping &amp; Delivery</Link>.
        </p>
        <PendingNote>The time window for reporting, and how replacements or refunds are handled.</PendingNote>
      </Section>
    </EditorialPage>
  );
}
