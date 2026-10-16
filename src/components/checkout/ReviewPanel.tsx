"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { SITE } from "@/content/site";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { Pending } from "@/components/content/Pending";
import { buildSummaryText, PAYMENT_LABEL } from "@/lib/checkout/summary";
import { normalisePkMobile, type CheckoutDetails } from "@/lib/checkout/validation";

/**
 * Honest end state while the order backend is not connected:
 * nothing has been placed and nothing has been charged.
 */
export function ReviewPanel({ details: d, onEdit }: { details: CheckoutDetails; onEdit: () => void }) {
  const cart = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const text = buildSummaryText(cart.lines, cart.subtotal, d);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, []);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(text);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  }

  const address = [d.address1, d.address2, d.city, d.province, d.postalCode, "Pakistan"].map((s) => s.trim()).filter(Boolean);

  return (
    <section aria-labelledby="co-review-h" className="pt-2">
      <p className="eyebrow text-stone">Details complete</p>
      <h2 id="co-review-h" ref={headingRef} tabIndex={-1} className="display mt-4 text-[clamp(2.4rem,8vw,4.25rem)] focus:outline-none">
        Your order details are <em>complete.</em>
      </h2>
      <div role="status" className="mt-8 border-l-2 border-obsidian py-1 pl-4 text-[0.95rem] leading-relaxed text-graphite">
        Online ordering opens soon —{" "}
        <strong className="font-medium text-obsidian">we have not placed an order or taken payment.</strong>
      </div>
      <p className="mt-5 max-w-[52ch] text-[0.95rem] leading-relaxed text-graphite">
        To continue now, copy your order summary and send it to us as an Instagram message. Your bag stays saved on this
        device.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={copySummary}
          className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-6"
        >
          {copy === "copied" ? "Copied" : "Copy order summary"}
        </button>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-obsidian px-6 text-ivory"
        >
          <IconInstagram size={18} /> Message on Instagram
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-xs text-stone">
        {copy === "copied" && "Copied — paste it into your message to " + SITE.instagramHandle + "."}
        {copy === "failed" && "Couldn’t copy automatically — open the summary below and copy it by hand."}
      </p>

      <details className="group mt-4 border-y border-obsidian/10" open={copy === "failed" || undefined}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm [&::-webkit-details-marker]:hidden">
          View summary text
          <span aria-hidden="true" className="text-stone transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <label htmlFor="co-summary-text" className="sr-only">
          Order summary text
        </label>
        <textarea
          id="co-summary-text"
          readOnly
          value={text}
          rows={14}
          className="mb-5 block w-full resize-y border border-obsidian/15 bg-transparent p-4 font-mono text-xs leading-relaxed text-graphite"
          onFocus={(e) => e.currentTarget.select()}
        />
      </details>

      <dl className="mt-10 border-t border-obsidian/10 text-sm">
        <Row label="Contact">
          {d.fullName}
          <br />
          {d.email}
          <br />
          {normalisePkMobile(d.phone) ?? d.phone}
        </Row>
        <Row label="Deliver to">{address.join(", ")}</Row>
        <Row label="Delivery">
          Standard delivery · <Pending>Fee to be confirmed</Pending>
        </Row>
        <Row label="Payment">
          {PAYMENT_LABEL[d.payment]}
          {d.payment === "bank-transfer" && (
            <span className="mt-1 block text-xs text-stone">Account details are shared after confirmation.</span>
          )}
        </Row>
        {d.notes.trim() && <Row label="Notes">{d.notes}</Row>}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
        <button type="button" onClick={onEdit} className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-6">
          Edit details
        </button>
        <Link href="/cart" className="link-line inline-flex min-h-11 items-center gap-2 self-start text-sm text-graphite sm:self-auto">
          Keep my bag &amp; return to it <IconArrow size={14} />
        </Link>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-obsidian/10 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="text-stone">{label}</dt>
      <dd className="break-words text-obsidian">{children}</dd>
    </div>
  );
}
