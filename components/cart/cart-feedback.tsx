"use client";

import { X } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartFeedback() {
  const { message, announcementId, storageWarning, dismiss } = useCart();
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg">
      <div className={message ? "pointer-events-auto flex gap-3 rounded-lg border border-muted/30 bg-white p-4 shadow-lg" : ""}>
        <div role="status" aria-live="polite" aria-atomic="true" className="min-w-0 flex-1 text-body">
          {message ? <p key={announcementId}>{message}{storageWarning ? ` ${storageWarning}` : ""}</p> : null}
        </div>
        {message ? (
          <button type="button" onClick={dismiss} aria-label="Dismiss cart notification" className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-background">
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
