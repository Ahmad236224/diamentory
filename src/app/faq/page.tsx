import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/content/site";
import { EditorialPage } from "@/components/content/EditorialPage";
import { Accordion } from "@/components/content/Accordion";
import { PendingNote } from "@/components/content/Pending";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering from Diamentory — payment, delivery, prices and imagery.",
  alternates: { canonical: "/faq" },
};

type Faq = {
  id: string;
  q: string;
  a: React.ReactNode;
  /** Plain-text answer — present only when the answer is confirmed. Drives FAQPage JSON-LD. */
  text?: string;
};

const GROUPS: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        id: "how-to-order",
        q: "Can I order online?",
        text: `Online ordering opens soon. You can browse, add pieces to your bag and complete your details at checkout, but no order is placed and no payment is taken yet. To order now, message us on Instagram at ${SITE.instagramHandle}.`,
        a: (
          <p>
            Online ordering opens soon. You can browse, add pieces to your bag and complete your details at checkout, but
            no order is placed and no payment is taken yet. To order now, message us on{" "}
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              Instagram<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            at {SITE.instagramHandle}.
          </p>
        ),
      },
      {
        id: "payment",
        q: "How can I pay?",
        text: "Checkout offers cash on delivery and bank transfer. For bank transfer, account details are shared after your order is confirmed. Online card payment is coming soon.",
        a: (
          <p>
            Checkout offers cash on delivery and bank transfer. For bank transfer, account details are shared after your
            order is confirmed. Online card payment is coming soon.
          </p>
        ),
      },
      {
        id: "currency",
        q: "Which currency are prices in?",
        text: "All prices are in Pakistani rupees (PKR).",
        a: <p>All prices are in Pakistani rupees (PKR).</p>,
      },
      {
        id: "track",
        q: "How do I track my order?",
        text: "Order tracking becomes available on the Track Order page when online ordering launches.",
        a: (
          <p>
            Order tracking becomes available on the <Link href="/track-order">Track Order</Link> page when online
            ordering launches.
          </p>
        ),
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        id: "where",
        q: "Where do you deliver?",
        text: "Diamentory delivers within Pakistan.",
        a: <p>Diamentory delivers within Pakistan.</p>,
      },
      {
        id: "delivery-cost",
        q: "How much is delivery, and how long does it take?",
        a: (
          <>
            <PendingNote>The delivery fee and delivery timeline.</PendingNote>
            <p>
              See <Link href="/shipping">Shipping &amp; Delivery</Link> for updates.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "pieces",
    title: "The pieces",
    items: [
      {
        id: "images",
        q: "Are the product images photographs?",
        text: "Yes. Every piece is shown in Diamentory’s own photographs — studio shots and frames from our Instagram. Prices, sizes and stock shown on this preview are still samples.",
        a: (
          <p>
            Yes. Every piece is shown in Diamentory&rsquo;s own photographs — studio shots and frames from our Instagram.
            Prices, sizes and stock shown on this preview are still samples.
          </p>
        ),
      },
      {
        id: "materials",
        q: "What are the pieces made of?",
        a: <PendingNote>Materials and finish details for each piece will be listed on its product page once verified.</PendingNote>,
      },
      {
        id: "care",
        q: "How should I care for my jewellery?",
        a: <PendingNote>Care guidance for each finish.</PendingNote>,
      },
      {
        id: "sizing",
        q: "How do I choose a ring size or chain length?",
        text: `Message us on Instagram at ${SITE.instagramHandle} and we will help you choose before you order.`,
        a: (
          <p>
            Message us on{" "}
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              Instagram<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            and we will help you choose before you order.
          </p>
        ),
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      {
        id: "returns-policy",
        q: "Can I return or exchange a piece?",
        a: (
          <>
            <PendingNote>The return window, exchange options and refund method.</PendingNote>
            <p>
              See <Link href="/returns">Returns &amp; Exchanges</Link> for updates.
            </p>
          </>
        ),
      },
    ],
  },
];

export default function Page() {
  const answered = GROUPS.flatMap((g) => g.items).filter((i) => i.text);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.text },
    })),
  };

  return (
    <EditorialPage
      eyebrow="Client care"
      title={
        <>
          Questions, <em>answered.</em>
        </>
      }
      intro="The things people ask us most. Anything not yet confirmed by Diamentory is marked clearly."
      toc={GROUPS.map((g) => ({ id: g.id, label: g.title }))}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {GROUPS.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="mb-14 scroll-mt-[calc(var(--header-h)+1.5rem)] last:mb-0">
          <h2 id={`${g.id}-h`} className="!mt-0">
            {g.title}
          </h2>
          <Accordion items={g.items.map(({ id, q, a }) => ({ id, q, a }))} />
        </section>
      ))}
    </EditorialPage>
  );
}
