import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, NAV_SUPPORT, SITE } from "@/content/site";
import { JewelArt } from "@/components/art/JewelArt";
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
      <header className="gutter mx-auto max-w-[1800px] border-b border-obsidian/10 pt-12 pb-10 sm:pt-16 lg:pt-24 lg:pb-16">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
          <p className="eyebrow text-stone lg:col-span-3 lg:pt-4">Client care</p>
          <div className="lg:col-span-9">
            <h1 className="display text-[clamp(2.9rem,12vw,8rem)]">
              Talk to <em>us.</em>
            </h1>
            <p className="mt-7 max-w-[44ch] text-[1.0625rem] leading-relaxed text-graphite">
              Questions about a piece, sizing, styling or an order — we&rsquo;re here. Instagram is the quickest way to
              reach Diamentory today.
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="dm-h" className="bg-obsidian text-ivory">
        <div className="mx-auto grid max-w-[1800px] lg:grid-cols-12">
          <div className="gutter flex flex-col justify-center py-14 lg:col-span-6 lg:py-24">
            <p className="eyebrow text-champagne">Direct message</p>
            <h2 id="dm-h" className="display mt-5 text-[clamp(2.4rem,8vw,5rem)]">
              {SITE.instagramHandle}
            </h2>
            <p className="mt-5 max-w-[38ch] text-ivory/70">
              Send us a message with the piece you&rsquo;re looking at, or a screenshot of your bag.
            </p>
            <div className="mt-9">
              <InstagramButton label="Message on Instagram" tone="light" />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:aspect-auto lg:min-h-[32rem]">
            <JewelArt form="cuban-chain" finish="gold" tone="dark" view={3} crop={[240, 300, 560, 520]} className="absolute inset-0" />
          </div>
        </div>
      </section>

      <div className="gutter mx-auto grid max-w-[1800px] gap-y-12 py-16 lg:grid-cols-12 lg:gap-x-8 lg:py-24">
        <section aria-labelledby="details-h" className="lg:col-span-6 lg:col-start-4">
          <h2 id="details-h" className="eyebrow mb-5 text-stone">
            Details
          </h2>
          <dl className="border-t border-obsidian/10">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-obsidian/10 py-5 sm:grid-cols-[10rem_1fr]">
                <dt className="text-sm text-stone">{r.label}</dt>
                <dd className="min-w-0 break-words text-[0.95rem]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-labelledby="help-h" className="lg:col-span-3 lg:col-start-10">
          <h2 id="help-h" className="eyebrow mb-5 text-stone">
            Helpful
          </h2>
          <ul className="border-t border-obsidian/10">
            {NAV_SUPPORT.filter((n) => n.href !== "/contact").map((n) => (
              <li key={n.href} className="border-b border-obsidian/10">
                <Link href={n.href} className="group flex min-h-14 items-center justify-between text-[0.95rem]">
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
