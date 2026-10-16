import { normalisePkMobile, type CheckoutDetails } from "./validation";

export type OrderLineInput = { slug: string; variantId: string; qty: number; unitPrice: number };

export type OrderPayload = {
  details: CheckoutDetails;
  lines: OrderLineInput[];
  subtotal: number;
};

export type SubmitResult =
  /** The order backend is not connected yet — nothing was placed, nothing was charged. */
  | { status: "unavailable" }
  /** A real order was created server-side (backend phase only). */
  | { status: "placed"; orderId: string }
  /** The request failed; safe to retry. */
  | { status: "error"; message: string };

/**
 * Single entry point for placing an order.
 *
 * FRONTEND PHASE: there is no order backend, so this deliberately returns
 * `{ status: "unavailable" }`. It never simulates a successful order or payment.
 *
 * TODO(backend phase):
 *  - POST the payload to a server action / route handler that re-validates every field
 *    server-side, re-prices lines from the database (never trust `unitPrice`), checks and
 *    reserves stock, and creates the order with an idempotency key.
 *  - Return `{ status: "placed", orderId }` and route to `/checkout/confirmation/[orderId]`
 *    (not built yet — add it together with the backend, rendering only server-verified data).
 *  - Bank transfer: show account details only on the server-rendered confirmation.
 *  - Card payments: integrate a hosted gateway (redirect / hosted fields) so card data
 *    never touches this app. Enable the "Online card payment" option only then.
 *  - Map network / validation failures to `{ status: "error", message }`.
 */
export async function submitOrder(payload: OrderPayload): Promise<SubmitResult> {
  // Sanity-check the payload shape so the call site is exercised exactly as it will be later.
  if (!payload.lines.length || !normalisePkMobile(payload.details.phone)) {
    return { status: "error", message: "Some details are missing. Please review the form and try again." };
  }
  return { status: "unavailable" };
}
