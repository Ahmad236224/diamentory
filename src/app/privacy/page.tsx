import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { EditorialPage, Section } from "@/components/content/EditorialPage";
import { Pending, PendingNote } from "@/components/content/Pending";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Diamentory collects, uses and protects your personal information. Draft pending review.",
  alternates: { canonical: "/privacy" },
};

const TOC = [
  { id: "about", label: "About this policy" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use it" },
  { id: "storage", label: "Browser storage" },
  { id: "sharing", label: "Sharing" },
  { id: "retention", label: "Retention & security" },
  { id: "rights", label: "Your choices" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function Page() {
  return (
    <EditorialPage
      eyebrow="Legal"
      draft
      title={
        <>
          Privacy <em>policy</em>
        </>
      }
      intro="This is a working draft describing how the Diamentory website handles information today. It has not yet been reviewed and will be finalised before online ordering opens."
      toc={TOC}
    >
      <p className="text-sm text-stone">
        Last updated: <Pending />
      </p>

      <Section id="about" title="About this policy">
        <p>
          This policy explains what information Diamentory (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles when you use this
          website, and why.
        </p>
        <PendingNote>The legal name and registered address of the business responsible for your information.</PendingNote>
      </Section>

      <Section id="collect" title="Information we collect">
        <p>When you use checkout, you enter:</p>
        <ul>
          <li>your name, email address and mobile number;</li>
          <li>your delivery address;</li>
          <li>your preferred delivery and payment method, and any order notes.</li>
        </ul>
        <p>
          We do not ask for or store payment card details on this website. While online ordering is not yet open, the
          details you enter at checkout are not sent to Diamentory — they stay in your browser (see below).
        </p>
        <p>
          If you message us on Instagram, Instagram&rsquo;s own privacy policy applies to that conversation as well.
        </p>
      </Section>

      <Section id="use" title="How we use it">
        <p>Once online ordering opens, we will use the details you provide to:</p>
        <ul>
          <li>process, deliver and support your order;</li>
          <li>contact you about your order;</li>
          <li>meet legal and accounting obligations.</li>
        </ul>
        <PendingNote>Whether, and how, we send marketing messages, and how you opt in or out.</PendingNote>
      </Section>

      <Section id="storage" title="Browser storage">
        <p>The website uses your browser&rsquo;s storage to make shopping work:</p>
        <ul>
          <li>
            <strong>Your bag</strong> is saved in local storage on your device, so it is still there when you come back.
          </li>
          <li>
            <strong>Your checkout details</strong> are saved in session storage so a page refresh doesn&rsquo;t lose
            them. Session storage is cleared when you close the tab.
          </li>
        </ul>
        <p>You can clear both at any time through your browser settings.</p>
        <PendingNote>Any analytics or advertising tools added to the website, and the cookies they use.</PendingNote>
      </Section>

      <Section id="sharing" title="Sharing">
        <p>We do not sell your personal information.</p>
        <PendingNote>
          The service providers who will receive information to fulfil orders — for example the courier and payment
          providers — and what they receive.
        </PendingNote>
      </Section>

      <Section id="retention" title="Retention & security">
        <PendingNote>How long order and customer records are kept, and the security measures in place.</PendingNote>
      </Section>

      <Section id="rights" title="Your choices">
        <p>
          You can ask us what information we hold about you, or ask us to correct or delete it, by messaging us on
          Instagram.
        </p>
        <PendingNote>How requests are verified and how quickly we respond, in line with applicable Pakistani law.</PendingNote>
      </Section>

      <Section id="changes" title="Changes">
        <p>
          We will update this page when our practices change — in particular when online ordering opens. The date at the
          top will show the latest version.
        </p>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          Questions about privacy? Message us on{" "}
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            Instagram<span className="sr-only"> (opens in a new tab)</span>
          </a>{" "}
          at {SITE.instagramHandle}.
        </p>
      </Section>
    </EditorialPage>
  );
}
