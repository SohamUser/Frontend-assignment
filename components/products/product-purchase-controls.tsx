"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { QuantitySelector } from "@/components/products/quantity-selector";

export function ProductPurchaseControls({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="mt-7">
      <QuantitySelector quantity={quantity}
        onIncrement={() => setQuantity((current) => Math.min(Number.MAX_SAFE_INTEGER, current + 1))}
        onDecrement={() => setQuantity((current) => Math.max(1, current - 1))} />
      <div className="mt-6"><AddToCartButton productId={productId} quantity={quantity} /></div>
    </div>
  );
}
