"use client";

import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";
import { NAV_PRIMARY, NAV_SECONDARY, NAV_SUPPORT, SITE } from "@/content/site";
import { IconArrow, IconClose, IconInstagram } from "@/components/ui/icons";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} side="left" label="Menu" tone="dark" hideTitle>
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between gutter">
        <span className="wordmark text-[0.95rem]">Diamentory</span>
        <button type="button" onClick={onClose} className="-mr-3 grid size-11 place-items-center" aria-label="Close menu">
          <IconClose size={22} />
        </button>
      </div>
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain gutter pb-8" onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onClose();
      }}>
        <p className="eyebrow mt-6 text-champagne">Shop</p>
        <ul className="stagger mt-3 border-t border-ivory/10">
          <li className="border-b border-ivory/10">
            <Link href="/shop" className="flex min-h-14 items-center justify-between py-3 font-serif text-[2rem] leading-none">
              Shop All <IconArrow className="text-champagne" />
            </Link>
          </li>
          {NAV_PRIMARY.map((n) => (
            <li key={n.href} className="border-b border-ivory/10">
              <Link href={n.href} className="flex min-h-14 items-center justify-between py-3 font-serif text-[2rem] leading-none">
                {n.label} <IconArrow className="text-champagne" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-8 grid grid-cols-2 gap-x-4">
          {NAV_SECONDARY.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="eyebrow flex min-h-11 items-center">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-8 text-champagne">Client care</p>
        <ul className="mt-2 grid grid-cols-2 gap-x-4">
          {NAV_SUPPORT.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="flex min-h-11 items-center text-sm text-ivory/75">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm"
        >
          <IconInstagram /> {SITE.instagramHandle}
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </a>
      </nav>
    </Dialog>
  );
}
