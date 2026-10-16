import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/content/site";
import { formatPrice } from "@/lib/format";
import { EditorialPage, Facts, Section } from "@/components/content/EditorialPage";
import { Pending, PendingNote, PendingValue } from "@/components/content/Pending";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "How Diamentory delivers within Pakistan — delivery fees, timelines, cash on delivery and tracking.",
  alternates: { canonical: "/shipping" },
};

const TOC = [
  { id: "overview", label: "At a glance" },
  { id: "where", label: "Where we deliver" },
  { id: "fees", label: "Fees & timelines" },
  { id: "payment", label: "Paying on delivery" },
  { id: "tracking", label: "Tracking" },
  { id: "receiving", label: "Receiving your order" },
];

const v = <T,>(p: { value: T | null; pending: boolean }) => (p.pending ? null : p.value);

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Client care"
      title={
        <>
          Shipping <em>&amp; delivery</em>
        </>
      }
      intro="Everything about how your pieces travel to you. Details marked “to be confirmed” are being finalised by Diamentory and will be published before online ordering opens."
      toc={TOC}
    >
      <Section id="overview" title="At a glance">
        <Facts
          items={[
            { label: "Delivering to", value: "Pakistan" },
            { label: "Standard delivery fee", value: <PendingValue value={v(BUSINESS.deliveryFee)} format={formatPrice} /> },
            {
              label: "Complimentary delivery",
              value: <PendingValue value={v(BUSINESS.freeDeliveryThreshold)} format={(n) => `On orders over ${formatPrice(n)}`} />,
            },
            { label: "Delivery time", value: <PendingValue value={v(BUSINESS.deliveryTime)} /> },
            { label: "Courier partner", value: <Pending /> },
          ]}
        />
      </Section>

      <Section id="where" title="Where we deliver">
        <p>
          Diamentory delivers within Pakistan. At checkout, the country is set to Pakistan and you choose your province
          or territory.
        </p>
        <PendingNote>Coverage for remote areas, and any cities with different timelines, will be listed here.</PendingNote>
      </Section>

      <Section id="fees" title="Fees & timelines">
        <p>
          Delivery charges are always shown separately from the price of your pieces — never folded in. Until the fee is
          confirmed, checkout shows it as “to be confirmed” and your total excludes delivery.
        </p>
        <PendingNote>Standard delivery fee, any complimentary-delivery threshold, order processing time and delivery time.</PendingNote>
      </Section>

      <Section id="payment" title="Paying on delivery">
        <p>
          Checkout offers cash on delivery and bank transfer. Online card payment is coming soon. For bank transfer,
          account details are shared after your order is confirmed.
        </p>
        <PendingNote>Any cash-on-delivery charge, and when a bank transfer must be received before dispatch.</PendingNote>
      </Section>

      <Section id="tracking" title="Tracking">
        <p>
          Order tracking will be available on our <Link href="/track-order">track order</Link> page when online ordering
          launches.
        </p>
        <PendingNote>How and when tracking details are sent (email, SMS or WhatsApp).</PendingNote>
      </Section>

      <Section id="receiving" title="Receiving your order">
        <p>
          Please check that the parcel is sealed and undamaged when it arrives. If anything looks wrong, message us on
          Instagram with photos as soon as you can.
        </p>
        <PendingNote>The time window for reporting a damaged, missing or incorrect item, and what happens next.</PendingNote>
        <p>
          For returns and exchanges, see <Link href="/returns">Returns &amp; Exchanges</Link>.
        </p>
      </Section>
    </EditorialPage>
  );
}
