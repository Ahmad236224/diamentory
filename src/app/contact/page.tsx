import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, NAV_SUPPORT, SITE } from "@/content/site";
import Image from "next/image";
import { getImage } from "@/content/images";
import { PageHeader } from "@/components/catalog/CatalogHeader";
import { Pending } from "@/components/content/Pending";
import { InstagramButton } from "@/components/content/HelpBand";
import { IconArrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Diamentory — message us on Instagram for orders, sizing and styling questions.",
  alternates: { canonical: "/contact" },
};

function value(p: { value: string | null; pending: boolean }, href?: (v: string) => string) {
  if (!p.value || p.pending) return <Pending />;
  return href ? (
    <a href={href(p.value)} className="link-line">
      {p.value}
    </a>
  ) : (
    p.value
  );
}

/** Brand Instagram photograph (1440px square) — a mood frame, not a product listing. */
const DM_PHOTO = getImage("brand-franco-chain-black-drape");

export default function Page() {
  const rows = [
    {
      label: "Instagram",
      value: (
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="link-line">
          {SITE.instagramHandle}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    { label: "Email", value: value(BUSINESS.email, (v) => `mailto:${v}`) },
    { label: "Phone", value: value(BUSINESS.phone, (v) => `tel:${v.replace(/[^\d+]/g, "")}`) },
    { label: "WhatsApp", value: value(BUSINESS.whatsapp, (v) => `https://wa.me/${v.replace(/\D/g, "")}`) },
    { label: "Hours", value: value(BUSINESS.hours) },
  ];

  return (
    <>
      <div className="border-b border-obsidian/10">
        <PageHeader
          eyebrow="Client care"
          title={
            <>
              Talk to <em>us.</em>
            </>
          }
          intro="Questions about a piece, sizing, styling or an order — we’re here. Instagram is the quickest way to reach Diamentory today."
        />
      </div>

      <section aria-labelledby="dm-h" className="bg-obsidian text-ivory">
        <div className="mx-auto grid max-w-[calc(var(--container)+2*var(--gutter))] grid-cols-12 lg:gap-x-[var(--grid-gap)] lg:px-[var(--gutter)]">
          <div className="col-span-12 flex flex-col justify-center px-[var(--gutter)] py-[var(--section-y-sm)] lg:col-span-6 lg:px-0">
            <p className="eyebrow text-champagne">Direct message</p>
            <h2 id="dm-h" className="t-h2 mt-5 normal-case">
              {SITE.instagramHandle}
            </h2>
            <p className="mt-5 max-w-[38ch] text-ivory/70">
              Send us a message with the piece you&rsquo;re looking at, or a screenshot of your bag.
            </p>
            <div className="mt-9">
              <InstagramButton label="Message on Instagram" tone="light" />
            </div>
          </div>
          <div className="reveal-mask relative col-span-12 aspect-square overflow-hidden lg:col-span-6 lg:my-[var(--section-y-sm)]">
            <Image
              src={DM_PHOTO.src}
              alt={DM_PHOTO.alt}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              // the frame carries an old watermark top-right: anchor bottom-left and crop it away
              className="origin-bottom-left scale-[1.22] object-cover object-left-bottom"
            />
          </div>
        </div>
      </section>

      <div className="wrap section-sm grid-12 gap-y-12">
        <section aria-labelledby="details-h" className="col-span-12 lg:col-span-6 lg:col-start-5">
          <h2 id="details-h" className="eyebrow mb-5 text-stone">
            Details
          </h2>
          <dl className="border-t border-obsidian/10">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-obsidian/10 py-5 sm:grid-cols-[10rem_1fr]">
                <dt className="text-sm text-stone">{r.label}</dt>
                <dd className="min-w-0 break-words text-[0.9375rem]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-labelledby="help-h" className="col-span-12 lg:col-span-3 lg:col-start-1 lg:row-start-1">
          <h2 id="help-h" className="eyebrow mb-5 text-stone">
            Helpful
          </h2>
          <ul className="border-t border-obsidian/10">
            {NAV_SUPPORT.filter((n) => n.href !== "/contact").map((n) => (
              <li key={n.href} className="border-b border-obsidian/10">
                <Link href={n.href} className="group flex min-h-14 items-center justify-between text-[0.9375rem]">
                  {n.label}
                  <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
