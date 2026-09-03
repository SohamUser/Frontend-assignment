"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartLink() {
  const { totalQuantity, isHydrated } = useCart();
  return (
    <Link href="/cart" aria-label={isHydrated ? `Cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}` : "Cart, loading"}
      className="flex min-h-11 items-center gap-2 rounded-md bg-footer px-3 text-sm font-semibold transition-colors hover:bg-black/40 sm:px-4">
      <ShoppingCart size={18} aria-hidden="true" />
      <span>Cart</span>
      <span aria-hidden="true" className="flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-caption font-bold">
        {isHydrated ? totalQuantity : "…"}
      </span>
    </Link>
  );
}
