import Link from "next/link";
import { BUSINESS, NAV_LEGAL, NAV_PRIMARY, NAV_SECONDARY, NAV_SUPPORT, SITE } from "@/content/site";
import { IconInstagram } from "@/components/ui/icons";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="bg-obsidian text-ivory">
      <div className="gutter mx-auto max-w-[1800px] pt-16 pb-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-xs text-[0.95rem] leading-relaxed text-ivory/70">
              Statement chains, bracelets, rings and pendants. Shipping all over Pakistan.
            </p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-ivory/80 hover:text-ivory"
            >
              <IconInstagram /> Follow {SITE.instagramHandle}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol title="Shop" links={[{ href: "/shop", label: "Shop All" }, ...NAV_PRIMARY, { href: "/new-arrivals", label: "New Arrivals" }]} />
            <FooterCol title="Diamentory" links={NAV_SECONDARY.filter((n) => n.href !== "/new-arrivals")} />
            <div>
              <FooterCol title="Client care" links={NAV_SUPPORT} />
              <div className="mt-6 space-y-1 text-sm text-ivory/60">
                {BUSINESS.email.value && <p>{BUSINESS.email.value}</p>}
                {BUSINESS.phone.value && <p>{BUSINESS.phone.value}</p>}
                {BUSINESS.hours.value && <p>{BUSINESS.hours.value}</p>}
              </div>
            </div>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="wordmark mt-20 select-none whitespace-nowrap text-center text-[8.6vw] leading-none tracking-[-0.03em] text-ivory"
        >
          Diamentory
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/10 pt-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Diamentory. Prices in PKR.</p>
          <ul className="flex gap-6">
            {NAV_LEGAL.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-11 items-center hover:text-ivory">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-champagne">{title}</p>
      <ul className="mt-4">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-10 items-center text-sm text-ivory/75 hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
