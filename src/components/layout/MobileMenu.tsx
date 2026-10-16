"use client";

import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";
import { Photo } from "@/components/media/Photo";
import { NAV_PRIMARY, NAV_SECONDARY, NAV_SUPPORT, SITE } from "@/content/site";
import { IconArrow, IconClose, IconInstagram } from "@/components/ui/icons";

/** One genuine photo per category, shown as a small thumbnail beside its link. */
const THUMB: Record<string, { id: string; focus: string }> = {
  "/shop/rings": { id: "product-ring-textured-band-gold", focus: "50% 53%" },
  "/shop/chains": { id: "product-locket-onyx-gold-snake", focus: "50% 45%" },
  "/shop/bracelets": { id: "brand-iced-cuban-bracelet-wrist", focus: "50% 45%" },
};

const rise = (i: number) => ({ "--d": `${90 + i * 55}ms` }) as React.CSSProperties;

/** Slides in from the left; the three categories first and large, then the rest, staggered. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} side="left" label="Menu" tone="dark" hideTitle>
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-ivory/15 gutter">
        <span className="wordmark text-[1.05rem]">Diamentory</span>
        <button type="button" onClick={onClose} className="-mr-3 grid size-11 place-items-center" aria-label="Close menu">
          <IconClose size={22} />
        </button>
      </div>
      <nav
        aria-label="Mobile"
        className="flex-1 overflow-y-auto overscroll-contain gutter pb-10"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a[href^='/']")) onClose();
        }}
      >
        <div className="rise mt-6 flex items-center justify-between" style={rise(0)}>
          <p className="eyebrow text-champagne">Shop</p>
          <Link href="/shop" className="eyebrow link-arrow inline-flex min-h-11 items-center gap-2">
            Shop all <IconArrow size={14} />
          </Link>
        </div>
        <ul className="mt-2 border-t border-ivory/15">
          {NAV_PRIMARY.map((n, i) => (
            <li key={n.href} className="rise border-b border-ivory/15" style={rise(i + 1)}>
              <Link href={n.href} className="group flex min-h-[5.5rem] items-center justify-between gap-4 py-3">
                <span className="t-h2">{n.label}</span>
                <span className="ratio-card relative w-12 shrink-0 overflow-hidden">
                  <Photo id={THUMB[n.href].id} dark alt="" sizes="48px" position={THUMB[n.href].focus} className="absolute inset-0" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="rise mt-8 grid grid-cols-2 gap-x-4" style={rise(4)}>
          {NAV_SECONDARY.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="eyebrow flex min-h-12 items-center">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="rise mt-8 border-t border-ivory/15 pt-6" style={rise(5)}>
          <p className="eyebrow text-champagne">Client care</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4">
            {NAV_SUPPORT.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex min-h-11 items-center text-sm text-ivory/75">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rise mt-6 inline-flex min-h-11 items-center gap-3 text-sm"
          style={rise(6)}
        >
          <IconInstagram /> {SITE.instagramHandle}
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </a>
      </nav>
    </Dialog>
  );
}
