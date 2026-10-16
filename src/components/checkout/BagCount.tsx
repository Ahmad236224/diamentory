"use client";

import { useCart } from "@/components/cart/CartProvider";

export function BagCount() {
  const cart = useCart();
  if (!cart.hydrated || cart.count === 0) return null;
  return (
    <p className="eyebrow text-stone tabular-nums">
      {cart.count} {cart.count === 1 ? "piece" : "pieces"}
    </p>
  );
}
