import Link from "next/link";
import { BUSINESS, NAV_LEGAL, NAV_PRIMARY, NAV_SECONDARY, NAV_SUPPORT, SITE } from "@/content/site";
import { IconInstagram } from "@/components/ui/icons";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

const SHOP = [{ href: "/shop", label: "Shop all" }, ...NAV_PRIMARY, { href: "/new-arrivals", label: "New Arrivals" }];

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="bg-obsidian text-ivory">
      <div className="wrap pt-[var(--section-y-sm)] pb-8">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
          <div className="lg:col-span-4">
            <p className="max-w-xs text-ivory/65">Rings, chains, lockets and bracelets. Shipping all over Pakistan.</p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm text-ivory/80 hover:text-ivory"
            >
              <IconInstagram /> <span className="link-line">{SITE.instagramHandle}</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <FooterCol title="Shop" links={SHOP} />
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

        {/* Wordmark set to the exact width of the content column */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 86"
          className="mt-16 block w-full select-none fill-ivory lg:mt-24"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="0"
            y="84"
            textLength="1000"
            lengthAdjust="spacing"
            className="wordmark"
            style={{ fontSize: "112px", letterSpacing: 0 }}
          >
            DIAMENTORY
          </text>
        </svg>

        <div className="mt-8 flex flex-col gap-2 border-t border-ivory/15 pt-4 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
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
              <span className="link-line">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
