"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { getProduct, type Product, type Variant } from "@/lib/catalog";

export const MAX_QTY = 10;
const KEY = "diamentory.cart.v1";

export type StoredLine = { slug: string; variantId: string; qty: number; priceAtAdd: number };

export type CartLine = StoredLine & {
  product?: Product;
  variant?: Variant;
  /** The line cannot be purchased as-is. */
  issue?: "unavailable" | "sold-out" | "reduced";
  /** Max purchasable for this line. */
  maxQty: number;
  priceChanged: boolean;
};

/* ── tiny external store backed by localStorage ── */
let lines: StoredLine[] = [];
let loaded = false;
const listeners = new Set<() => void>();
const EMPTY: StoredLine[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      lines = parsed.filter(
        (l): l is StoredLine =>
          l && typeof l.slug === "string" && typeof l.variantId === "string" && Number.isFinite(l.qty),
      );
    }
  } catch {
    lines = [];
  }
}

function commit(next: StoredLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — cart still works for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function snapshot() {
  load();
  return lines;
}

/* ── context ── */
type CartCtx = {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  hasIssues: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, variantId: string, qty: number) => { ok: boolean; message?: string };
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  /** Variant id of the line added during the current drawer session (for the highlight); cleared on close. */
  lastAdded: string | null;
  /** Increments on every successful add, and once more when the drawer closes after an add (drives the bag-count bump). */
  addSeq: number;
};

const Ctx = createContext<CartCtx | null>(null);

function resolve(l: StoredLine): CartLine {
  const product = getProduct(l.slug);
  const variant = product?.variants.find((v) => v.id === l.variantId);
  if (!product || !variant) return { ...l, product, variant, issue: "unavailable", maxQty: 0, priceChanged: false };
  const maxQty = Math.min(MAX_QTY, Math.max(0, variant.stock));
  const issue = maxQty === 0 ? "sold-out" : l.qty > maxQty ? "reduced" : undefined;
  return { ...l, product, variant, issue, maxQty, priceChanged: variant.price !== l.priceAtAdd };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [addSeq, setAddSeq] = useState(0);

  const resolved = useMemo(() => stored.map(resolve), [stored]);

  const add = useCallback<CartCtx["add"]>((slug, variantId, qty) => {
    const product = getProduct(slug);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (!product || !variant) return { ok: false, message: "This option is no longer available." };
    if (variant.stock <= 0) return { ok: false, message: "This option is sold out." };
    const max = Math.min(MAX_QTY, variant.stock);
    const existing = lines.find((l) => l.variantId === variantId);
    const current = existing?.qty ?? 0;
    if (current >= max) return { ok: false, message: `You already have the maximum available (${max}) in your bag.` };
    const nextQty = Math.min(max, current + Math.max(1, qty));
    const next = existing
      ? lines.map((l) => (l.variantId === variantId ? { ...l, qty: nextQty, priceAtAdd: variant.price } : l))
      : [...lines, { slug, variantId, qty: nextQty, priceAtAdd: variant.price }];
    commit(next);
    setLastAdded(variantId);
    setAddSeq((n) => n + 1);
    const capped = current + qty > max;
    return { ok: true, message: capped ? `Only ${max} available — quantity adjusted.` : undefined };
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    if (qty <= 0) return commit(lines.filter((l) => l.variantId !== variantId));
    commit(lines.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)));
  }, []);

  const remove = useCallback((variantId: string) => {
    commit(lines.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => commit([]), []);

  const value = useMemo<CartCtx>(() => {
    const purchasable = resolved.filter((l) => l.variant && l.issue !== "sold-out" && l.issue !== "unavailable");
    return {
      hydrated,
      lines: resolved,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      subtotal: purchasable.reduce((s, l) => s + (l.variant!.price * Math.min(l.qty, l.maxQty)), 0),
      hasIssues: resolved.some((l) => l.issue),
      isOpen,
      open: () => setOpen(true),
      close: () => {
        setOpen(false);
        // replay the count bump where the drawer covered the header (full-width on phones)
        if (lastAdded) {
          setLastAdded(null);
          setAddSeq((n) => n + 1);
        }
      },
      add,
      setQty,
      remove,
      clear,
      lastAdded,
      addSeq,
    };
  }, [resolved, hydrated, isOpen, add, setQty, remove, clear, lastAdded, addSeq]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
