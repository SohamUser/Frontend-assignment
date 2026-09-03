"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <fieldset>
      <legend className="mb-3 text-body font-semibold">Quantity</legend>
      <div className="inline-flex items-center rounded-lg border border-muted/40 bg-white">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity === 1}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          className="flex size-11 items-center justify-center rounded-l-lg text-navy enabled:hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <output aria-label="Quantity" aria-live="polite" aria-atomic="true" className="min-w-12 px-3 text-center text-body font-semibold">
          {quantity}
        </output>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={quantity === Number.MAX_SAFE_INTEGER}
          onClick={() => setQuantity((current) => Math.min(Number.MAX_SAFE_INTEGER, current + 1))}
          className="flex size-11 items-center justify-center rounded-r-lg text-navy enabled:hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </fieldset>
  );
}
