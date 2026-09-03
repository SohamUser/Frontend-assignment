"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
  productName?: string;
}

export function QuantitySelector({ quantity, onIncrement, onDecrement, label = "Quantity", productName }: QuantitySelectorProps) {
  const accessibleLabel = productName ? `${productName} quantity` : label;
  return (
    <fieldset>
      <legend className="mb-3 text-body font-semibold">{label}</legend>
      <div className="inline-flex items-center rounded-lg border border-muted/40 bg-white">
        <button
          type="button"
          aria-label={`Decrease ${accessibleLabel}`}
          disabled={quantity === 1}
          onClick={onDecrement}
          className="flex size-11 items-center justify-center rounded-l-lg text-navy enabled:hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <output aria-label={accessibleLabel} aria-live="polite" aria-atomic="true" className="min-w-12 px-3 text-center text-body font-semibold">
          {quantity}
        </output>
        <button
          type="button"
          aria-label={`Increase ${accessibleLabel}`}
          disabled={quantity === Number.MAX_SAFE_INTEGER}
          onClick={onIncrement}
          className="flex size-11 items-center justify-center rounded-r-lg text-navy enabled:hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </fieldset>
  );
}
