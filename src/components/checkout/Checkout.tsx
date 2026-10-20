"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { BUSINESS, PAKISTAN_PROVINCES } from "@/content/site";
import { IconArrow, IconBag, IconChevron } from "@/components/ui/icons";
import { Pending } from "@/components/content/Pending";
import { formatPrice } from "@/lib/format";
import { computeTotals } from "@/lib/checkout/totals";
import { clearDraft, loadDraft, saveDraft } from "@/lib/checkout/draft";
import { submitOrder } from "@/lib/checkout/submit";
import {
  EMPTY_DETAILS,
  FIELD_LABEL,
  FIELD_ORDER,
  NOTES_MAX,
  validateAll,
  type CheckoutDetails,
  type FieldName,
} from "@/lib/checkout/validation";
import { SummaryLines, TotalsBlock } from "./OrderSummary";
import { SelectField, TextArea, TextField, FieldMessage } from "./Field";
import { ReviewPanel } from "./ReviewPanel";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "unavailable" } | { kind: "error"; message: string };

/** DOM id for each field — also the error-summary link target. */
const fieldId = (f: FieldName) => (f === "payment" ? "co-payment-cod" : f === "delivery" ? "co-delivery-standard" : `co-${f}`);

export function Checkout() {
  const cart = useCart();
  if (!cart.hydrated) return <CheckoutSkeleton />;
  if (cart.lines.length === 0) return <Blocked kind="empty" />;
  if (cart.hasIssues) return <Blocked kind="issues" />;
  return <CheckoutForm />;
}

function CheckoutForm() {
  const cart = useCart();
  // Rendered only after hydration, so reading sessionStorage in the initialiser is safe.
  const [details, setDetails] = useState<CheckoutDetails>(() => loadDraft() ?? EMPTY_DETAILS);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const focusNext = useRef<string | null>(null);

  useEffect(() => {
    saveDraft(details);
  }, [details]);

  // Move focus after React has committed aria-invalid / error text, so assistive tech reads them.
  useEffect(() => {
    if (!focusNext.current) return;
    const el = document.getElementById(focusNext.current);
    focusNext.current = null;
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  });

  const allErrors = validateAll(details);
  const err = (f: FieldName) => (touched[f] ? allErrors[f] : undefined);
  const summaryErrors = attempted ? FIELD_ORDER.filter((f) => allErrors[f]) : [];

  const set = <K extends FieldName>(f: K, v: CheckoutDetails[K]) => setDetails((d) => ({ ...d, [f]: v }));
  const blur = (f: FieldName) => () => setTouched((t) => (t[f] ? t : { ...t, [f]: true }));

  const bind = (f: Exclude<FieldName, "delivery" | "payment">) => ({
    id: fieldId(f),
    name: f,
    value: details[f],
    error: err(f),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(f, e.target.value),
    onBlur: blur(f),
  });

  const focusField = (f: FieldName) => {
    focusNext.current = fieldId(f);
    setTouched((t) => ({ ...t })); // trigger a commit so the effect runs
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const errs = validateAll(details);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    setAttempted(true);
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) {
      focusNext.current = fieldId(first);
      setStatus({ kind: "idle" });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await submitOrder({
        details,
        lines: cart.lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty, unitPrice: l.variant?.price ?? 0 })),
        subtotal: cart.subtotal,
      });
      if (res.status === "unavailable") setStatus({ kind: "unavailable" });
      else if (res.status === "error") setStatus({ kind: "error", message: res.message });
      else {
        // TODO(backend phase): clear the bag + draft and route to /checkout/confirmation/[orderId].
        clearDraft();
        setStatus({ kind: "error", message: "Order confirmation is not available yet." });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn’t reach Diamentory just now. Check your connection and try again." });
    }
  }

  const reviewing = status.kind === "unavailable";

  return (
    <div className="wrap pb-[var(--section-y)]">
      <Steps current={reviewing ? 2 : 1} />
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
        <MobileSummary />

        <div className="min-w-0 lg:col-span-7">
          {reviewing ? (
            <ReviewPanel details={details} onEdit={() => setStatus({ kind: "idle" })} />
          ) : (
            <form noValidate onSubmit={onSubmit} aria-label="Checkout details" className="pt-2">
              <p className="mb-8 border-l-2 border-obsidian py-1 pl-4 text-sm leading-relaxed text-graphite">
                Online ordering opens soon. You can complete your details now —{" "}
                <strong className="font-medium text-obsidian">no order will be placed and no payment taken.</strong>
              </p>

              {summaryErrors.length > 0 && (
                <div role="alert" className="mb-8 border border-error/60 bg-error/[0.04] p-5">
                  <p className="text-sm font-medium text-error">
                    Please check {summaryErrors.length} {summaryErrors.length === 1 ? "detail" : "details"} below
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {summaryErrors.map((f) => (
                      <li key={f}>
                        <a
                          href={`#${fieldId(f)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            focusField(f);
                          }}
                          className="text-[0.8125rem] text-error underline underline-offset-4"
                        >
                          {FIELD_LABEL[f]} — {allErrors[f]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Step n="01" title="Contact">
                <div className="grid gap-5">
                  <TextField label="Full name" autoComplete="name" autoCapitalize="words" {...bind("fullName")} />
                  <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    hint="For your order summary and updates."
                    {...bind("email")}
                  />
                  <TextField
                    label="Mobile number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="03XX XXXXXXX"
                    hint="Pakistani mobile, e.g. 0300 1234567 or +92 300 1234567 — for the courier."
                    {...bind("phone")}
                  />
                </div>
              </Step>

              <Step n="02" title="Delivery address">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    className="sm:col-span-2"
                    label="Address"
                    autoComplete="shipping address-line1"
                    placeholder="House number, street, area"
                    {...bind("address1")}
                  />
                  <TextField
                    className="sm:col-span-2"
                    label="Apartment, suite, landmark"
                    optional
                    autoComplete="shipping address-line2"
                    {...bind("address2")}
                  />
                  <TextField label="City" autoComplete="shipping address-level2" autoCapitalize="words" {...bind("city")} />
                  <SelectField
                    label="Province / territory"
                    autoComplete="shipping address-level1"
                    placeholder="Select province"
                    options={PAKISTAN_PROVINCES}
                    {...bind("province")}
                  />
                  <TextField
                    label="Postal code"
                    optional
                    inputMode="numeric"
                    autoComplete="shipping postal-code"
                    maxLength={5}
                    placeholder="5 digits"
                    {...bind("postalCode")}
                  />
                  <TextField id="co-country" label="Country" value="Pakistan" readOnly autoComplete="shipping country-name" hint="We currently deliver within Pakistan." />
                </div>
              </Step>

              <Step n="03" title="Delivery method">
                <ChoiceCard
                  id={fieldId("delivery")}
                  name="delivery"
                  checked={details.delivery === "standard"}
                  onChange={() => set("delivery", "standard")}
                  title="Standard delivery"
                  aside={
                    BUSINESS.deliveryFee.pending ? <Pending>To be confirmed</Pending> : formatPrice(BUSINESS.deliveryFee.value ?? 0)
                  }
                >
                  Delivery time:{" "}
                  {BUSINESS.deliveryTime.value && !BUSINESS.deliveryTime.pending ? BUSINESS.deliveryTime.value : <Pending>To be confirmed</Pending>}
                </ChoiceCard>
              </Step>

              <Step n="04" title="Payment" errorId={err("payment") ? "co-payment-error" : undefined}>
                <div className="grid gap-3">
                  <ChoiceCard
                    id="co-payment-cod"
                    name="payment"
                    checked={details.payment === "cod"}
                    onChange={() => {
                      set("payment", "cod");
                      setTouched((t) => ({ ...t, payment: true }));
                    }}
                    invalid={!!err("payment")}
                    describedBy={err("payment") ? "co-payment-error" : undefined}
                    title="Cash on delivery"
                  >
                    Pay in cash when your order arrives.
                  </ChoiceCard>
                  <ChoiceCard
                    id="co-payment-bank"
                    name="payment"
                    checked={details.payment === "bank-transfer"}
                    onChange={() => {
                      set("payment", "bank-transfer");
                      setTouched((t) => ({ ...t, payment: true }));
                    }}
                    invalid={!!err("payment")}
                    describedBy={err("payment") ? "co-payment-error" : undefined}
                    title="Bank transfer"
                  >
                    Account details will be shared after confirmation — subject to confirmation.
                  </ChoiceCard>
                  <ChoiceCard id="co-payment-card" name="payment" checked={false} disabled title="Online card payment" aside={<span className="eyebrow text-stone">Coming soon</span>}>
                    Not yet available.
                  </ChoiceCard>
                  <FieldMessage id="co-payment" error={err("payment")} />
                </div>
              </Step>

              <Step n="05" title="Order notes">
                <TextArea
                  label="Anything we should know?"
                  optional
                  maxLength={NOTES_MAX}
                  rows={4}
                  hint={`Delivery instructions, gifting, sizing questions. ${details.notes.length}/${NOTES_MAX}`}
                  {...bind("notes")}
                />
              </Step>

              <div className="border-t border-obsidian/10 pt-8">
                <div className="mb-6 lg:hidden">
                  <TotalsBlock subtotal={cart.subtotal} />
                </div>
                {status.kind === "error" && (
                  <div role="alert" className="mb-5 border border-error/60 bg-error/[0.04] p-4 text-sm text-error">
                    {status.message}
                  </div>
                )}
                <button
                  type="submit"
                  aria-disabled={status.kind === "submitting" || undefined}
                  className="btn btn-dark min-h-14 w-full aria-disabled:opacity-60"
                >
                  {status.kind === "submitting" ? (
                    <>
                      <span aria-hidden="true" className="size-3 animate-spin border border-ivory border-t-transparent" />
                      Checking details…
                    </>
                  ) : status.kind === "error" ? (
                    "Try again"
                  ) : (
                    <>
                      Confirm details <IconArrow size={16} />
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-stone" aria-live="polite">
                  {status.kind === "submitting" ? "Checking your details…" : "Nothing is charged — online ordering opens soon."}
                </p>
              </div>
            </form>
          )}
        </div>

        <aside aria-labelledby="co-summary-h" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)] border border-obsidian/10 p-7">
            <h2 id="co-summary-h" className="eyebrow mb-6 flex items-baseline justify-between">
              Order summary
              <Link href="/cart" className="link-line normal-case tracking-normal text-xs text-stone">
                Edit bag
              </Link>
            </h2>
            <SummaryLines />
            <div className="mt-7 border-t border-obsidian/10 pt-6">
              <TotalsBlock subtotal={cart.subtotal} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Steps({ current }: { current: 0 | 1 | 2 }) {
  const steps = ["Bag", "Details", "Review"];
  return (
    <ol className="mb-8 flex items-center gap-3 text-[0.6875rem] tracking-[0.18em] uppercase lg:mb-12" aria-label="Checkout progress">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-obsidian/25 sm:w-10" />}
          {i === 0 ? (
            <Link href="/cart" className="link-line text-stone hover:text-obsidian">
              {s}
            </Link>
          ) : (
            <span aria-current={i === current ? "step" : undefined} className={i === current ? "text-obsidian" : "text-stone"}>
              {s}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function MobileSummary() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const id = useId();
  const t = computeTotals(cart.subtotal);
  return (
    <section aria-label="Order summary" className="-mx-[var(--gutter)] border-y border-obsidian/10 bg-obsidian/[0.03] lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="gutter flex min-h-14 w-full items-center justify-between gap-4 text-left"
      >
        <span className="flex items-center gap-2.5 text-sm">
          <IconBag size={18} />
          {open ? "Hide" : "Show"} order summary
          <IconChevron dir={open ? "up" : "down"} size={14} />
        </span>
        <span className="text-sm tabular-nums">
          {formatPrice(t.total)}
          {t.deliveryPending && <span className="sr-only"> plus delivery, to be confirmed</span>}
        </span>
      </button>
      <div id={id} hidden={!open} className="gutter pt-3 pb-7">
        <SummaryLines />
        <div className="mt-6 border-t border-obsidian/10 pt-5">
          <TotalsBlock subtotal={cart.subtotal} />
        </div>
        <Link href="/cart" className="link-line mt-5 inline-block text-xs text-graphite">
          Edit bag
        </Link>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  optional,
  errorId,
  children,
}: {
  n: string;
  title: string;
  optional?: boolean;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-obsidian/10 pt-7 pb-10" aria-describedby={errorId}>
      <legend className="float-left mb-7 flex w-full items-center gap-3">
        <span className="tag tabular-nums">{n}</span>
        <span className="t-h3">{title}</span>
        {optional && <span className="ml-auto text-xs text-stone">Optional</span>}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function ChoiceCard({
  id,
  name,
  checked,
  onChange,
  disabled,
  invalid,
  describedBy,
  title,
  aside,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  title: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "flex min-h-16 gap-4 border p-4 transition-colors sm:p-5",
        disabled
          ? "cursor-not-allowed border-dashed border-obsidian/20 text-stone"
          : checked
            ? "cursor-pointer border-obsidian bg-obsidian/[0.03]"
            : invalid
              ? "cursor-pointer border-error"
              : "cursor-pointer border-obsidian/20 hover:border-obsidian/45",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-describedby={[describedBy, `${id}-desc`].filter(Boolean).join(" ")}
        className="mt-0.5 size-[1.125rem] shrink-0 accent-obsidian"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <span className={clsx("text-[0.9375rem]", !disabled && "text-obsidian")}>{title}</span>
          {aside && <span className="text-sm">{aside}</span>}
        </span>
        {children && (
          <span id={`${id}-desc`} className="text-[0.8125rem] leading-relaxed text-stone">
            {children}
          </span>
        )}
      </span>
    </label>
  );
}

function Blocked({ kind }: { kind: "empty" | "issues" }) {
  return (
    <div className="wrap pb-[var(--section-y)]">
      <div className="max-w-xl border-t border-obsidian/10 pt-10">
        <p className="t-h2">
          {kind === "empty" ? (
            <>
              Your bag is <em>empty.</em>
            </>
          ) : (
            <>
              Your bag needs <em>attention.</em>
            </>
          )}
        </p>
        <p className="mt-5 text-graphite">
          {kind === "empty"
            ? "Add a piece to your bag to continue to checkout."
            : "One or more pieces have sold out, are no longer available, or exceed the stock we have. Update your bag to continue."}
        </p>
        <Link
          href={kind === "empty" ? "/shop" : "/cart"}
          className="btn btn-dark mt-9"
        >
          {kind === "empty" ? "Shop all" : "Review your bag"} <IconArrow size={16} />
        </Link>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="wrap min-h-[100svh] pb-[var(--section-y)]" aria-busy="true">
      <p className="sr-only" role="status">
        Loading checkout…
      </p>
      <div className="skeleton mb-8 h-4 w-48 lg:mb-12" />
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-[var(--grid-gap)]">
        <div className="skeleton -mx-[var(--gutter)] h-14 lg:hidden" />
        <div className="space-y-5 lg:col-span-7">
          <div className="skeleton h-10 w-1/2" />
          <div className="skeleton h-12" />
          <div className="skeleton h-12" />
          <div className="skeleton h-12" />
        </div>
        <div className="skeleton hidden h-96 lg:col-span-4 lg:col-start-9 lg:block" />
      </div>
    </div>
  );
}
