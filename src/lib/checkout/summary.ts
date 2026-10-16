import { getFinish } from "@/lib/catalog";
import type { CartLine } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { computeTotals } from "./totals";
import { normalisePkMobile, type CheckoutDetails } from "./validation";

export const PAYMENT_LABEL: Record<string, string> = {
  cod: "Cash on delivery",
  "bank-transfer": "Bank transfer",
};

export function lineLabel(l: CartLine) {
  const v = l.variant;
  const parts = [v ? getFinish(v.finish)?.name : null, v?.size].filter(Boolean);
  return parts.join(" · ");
}

/** Plain-text order summary the shopper can paste into an Instagram DM. */
export function buildSummaryText(lines: CartLine[], subtotal: number, d: CheckoutDetails) {
  const t = computeTotals(subtotal);
  const items = lines
    .filter((l) => l.variant)
    .map((l) => `• ${l.product?.name ?? "Item"} (${lineLabel(l)}) × ${l.qty} — ${formatPrice(l.variant!.price * l.qty)}`);
  const address = [d.address1, d.address2, d.city, d.province, d.postalCode, "Pakistan"]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  return [
    "DIAMENTORY — order request",
    "",
    ...items,
    "",
    `Subtotal: ${formatPrice(t.subtotal)}`,
    `Delivery: ${t.deliveryPending ? "to be confirmed" : formatPrice(t.delivery!)}`,
    t.deliveryPending ? `Total: ${formatPrice(t.total)} + delivery` : `Total: ${formatPrice(t.total)}`,
    "",
    `Name: ${d.fullName.trim()}`,
    `Mobile: ${normalisePkMobile(d.phone) ?? d.phone.trim()}`,
    `Email: ${d.email.trim()}`,
    `Deliver to: ${address}`,
    `Payment preference: ${PAYMENT_LABEL[d.payment] ?? "—"}`,
    ...(d.notes.trim() ? [`Notes: ${d.notes.trim()}`] : []),
  ].join("\n");
}
