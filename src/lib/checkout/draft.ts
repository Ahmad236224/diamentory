import { coerceDetails, type CheckoutDetails } from "./validation";

/**
 * The checkout draft lives in sessionStorage so a refresh mid-checkout restores it,
 * and it disappears when the tab is closed. It never contains payment card data —
 * the form does not collect any.
 */
const KEY = "diamentory.checkout.draft.v1";

export function loadDraft(): CheckoutDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? coerceDetails(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(d: CheckoutDetails) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable — the form still works, it just won't survive a refresh */
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
