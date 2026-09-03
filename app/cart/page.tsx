import type { Metadata } from "next";
import { CartContents } from "@/components/cart/cart-contents";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your WhatBytes Store cart, update quantities, and see your total.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartContents />;
}
