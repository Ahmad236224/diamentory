import { BUSINESS } from "@/content/site";

export type Totals = {
  subtotal: number;
  /** Delivery fee in PKR, or null while Diamentory has not confirmed it. */
  delivery: number | null;
  /** Grand total when every component is known; otherwise the known part only. */
  total: number;
  deliveryPending: boolean;
};

/** Transparent totals — never guesses a delivery fee. */
export function computeTotals(subtotal: number): Totals {
  const fee = BUSINESS.deliveryFee.pending ? null : BUSINESS.deliveryFee.value;
  const threshold = BUSINESS.freeDeliveryThreshold.pending ? null : BUSINESS.freeDeliveryThreshold.value;
  let delivery: number | null = fee;
  if (fee != null && threshold != null && subtotal >= threshold) delivery = 0;
  return {
    subtotal,
    delivery,
    total: subtotal + (delivery ?? 0),
    deliveryPending: delivery == null,
  };
}
