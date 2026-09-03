"use client";

import { useCart } from "@/context/cart-context";

export function AddToCartButton({ productId, quantity = 1 }: { productId: string; quantity?: number }) {
  const { add, isHydrated } = useCart();
  return (
    <button
      type="button"
      disabled={!isHydrated}
      onClick={() => add(productId, quantity)}
      className="min-h-11 w-full rounded-md bg-accent px-3 py-2 text-body font-semibold text-white enabled:hover:bg-navy disabled:cursor-wait disabled:opacity-55"
    >
      {isHydrated ? "Add to Cart" : "Loading cart..."}
    </button>
  );
}
