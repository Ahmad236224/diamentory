"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/content/site";
import { IconArrow, IconInstagram } from "@/components/ui/icons";
import { normalisePkMobile } from "@/lib/checkout/validation";
import { TextField } from "./Field";

type Errors = { order?: string; contact?: string };

function validate(order: string, contact: string): Errors {
  const e: Errors = {};
  if (!order.trim()) e.order = "Enter your order number.";
  const c = contact.trim();
  if (!c) e.contact = "Enter the email or mobile number used for the order.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c) && !normalisePkMobile(c))
    e.contact = "Enter a valid email address or Pakistani mobile number.";
  return e;
}

/**
 * Order lookup UI. There is no order backend yet, so a valid submission shows an
 * honest "not available yet" state — it never pretends to find or track an order.
 * TODO(backend phase): look up the order server-side (rate-limited, matching both fields).
 */
export function TrackOrderForm() {
  const [order, setOrder] = useState("");
  const [contact, setContact] = useState("");
  const [touched, setTouched] = useState<{ order?: boolean; contact?: boolean }>({});
  const [done, setDone] = useState(false);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const focusId = useRef<string | null>(null);

  const errors = validate(order, contact);
  const shown: Errors = { order: touched.order ? errors.order : undefined, contact: touched.contact ? errors.contact : undefined };

  useEffect(() => {
    if (done) resultRef.current?.focus();
  }, [done]);
  useEffect(() => {
    if (focusId.current) {
      document.getElementById(focusId.current)?.focus();
      focusId.current = null;
    }
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ order: true, contact: true });
    if (errors.order) focusId.current = "to-order";
    else if (errors.contact) focusId.current = "to-contact";
    else setDone(true);
  }

  if (done) {
    return (
      <section aria-labelledby="to-result-h" className="border border-obsidian/15 p-6 sm:p-9">
        <p className="eyebrow text-stone">Order {order.trim()}</p>
        <h2 id="to-result-h" ref={resultRef} tabIndex={-1} className="display mt-4 text-[clamp(2rem,6vw,3.25rem)] focus:outline-none">
          Tracking opens <em>with online ordering.</em>
        </h2>
        <p className="mt-5 max-w-[48ch] leading-relaxed text-graphite">
          Order tracking becomes available when online ordering launches. We have not looked up any order — none have
          been placed through this website yet.
        </p>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-graphite">
          If you arranged an order with us directly, message us on Instagram and we will update you there.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-obsidian px-6 text-ivory"
          >
            <IconInstagram size={18} /> Message {SITE.instagramHandle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="eyebrow inline-flex min-h-12 items-center justify-center border border-obsidian px-6"
          >
            Check another order
          </button>
        </div>
      </section>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Track an order" className="grid gap-6">
      <TextField
        id="to-order"
        label="Order number"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder="e.g. DM-10234"
        value={order}
        error={shown.order}
        onChange={(e) => setOrder(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, order: true }))}
      />
      <TextField
        id="to-contact"
        label="Email or mobile number"
        autoComplete="email"
        spellCheck={false}
        hint="The one used when ordering."
        value={contact}
        error={shown.contact}
        onChange={(e) => setContact(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
      />
      <button type="submit" className="eyebrow inline-flex min-h-14 items-center justify-center gap-3 bg-obsidian px-6 text-ivory">
        Track order <IconArrow size={16} />
      </button>
    </form>
  );
}
