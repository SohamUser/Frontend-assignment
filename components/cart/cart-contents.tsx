"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { formatPrice } from "@/lib/format-price";

export function CartContents() {
  const { items, subtotal, totalQuantity, isHydrated, storageWarning, increment, decrement, remove } = useCart();
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section aria-labelledby="cart-heading">
      <h1 id="cart-heading" ref={heading} tabIndex={-1} className="text-page-title font-bold text-navy">Your Cart</h1>
      {storageWarning ? <p role="status" className="mt-4 rounded-md border border-muted/30 bg-white p-4 text-body">{storageWarning}</p> : null}
      {!isHydrated ? (
        <p role="status" className="py-12 text-body text-muted">Loading your saved cart...</p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center">
          <h2 className="text-section-title font-semibold">Your cart is empty</h2>
          <p className="mt-3 text-body text-muted">Browse the catalog and add something you like.</p>
          <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-5 py-3 text-body font-semibold text-white hover:bg-navy">Browse products</Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-body text-muted">{totalQuantity} {totalQuantity === 1 ? "item" : "items"}</p>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ul className="grid gap-4">
              {items.map(({ product, quantity, lineTotalCents }) => (
                <li key={product.id}>
                  <article aria-labelledby={`cart-${product.id}`} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-xl bg-white p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
                    <Link href={`/product/${product.id}`} className="relative block aspect-square self-start rounded-md sm:row-span-3">
                      <Image src={product.image} alt={product.imageAlt} fill sizes="(min-width: 640px) 112px, 80px" className="object-contain" />
                    </Link>
                    <div className="min-w-0">
                      <h2 id={`cart-${product.id}`} className="text-section-title font-semibold">
                        <Link href={`/product/${product.id}`} className="rounded-sm hover:underline">{product.title}</Link>
                      </h2>
                      <p className="mt-1 text-body text-muted">Unit price: {formatPrice(product.price)}</p>
                    </div>
                    <div className="col-span-2 flex flex-wrap items-end justify-between gap-4 sm:col-start-2 sm:col-span-1">
                      <QuantitySelector quantity={quantity} productName={product.title}
                        onIncrement={() => increment(product.id)} onDecrement={() => decrement(product.id)} />
                      <p className="text-body">Line total: <strong>{formatPrice(lineTotalCents / 100)}</strong></p>
                    </div>
                    <button type="button" aria-label={`Remove ${product.title}`} onClick={() => { remove(product.id); heading.current?.focus(); }}
                      className="col-span-2 flex min-h-11 w-fit items-center gap-2 rounded-md px-2 text-body text-accent hover:bg-background sm:col-start-2 sm:col-span-1">
                      <Trash2 size={17} aria-hidden="true" />Remove
                    </button>
                  </article>
                </li>
              ))}
            </ul>
            <aside aria-labelledby="summary-heading" className="rounded-lg border border-navy/20 bg-white p-6">
              <h2 id="summary-heading" className="text-section-title font-semibold text-navy">Order summary</h2>
              <dl className="mt-6 text-body">
                <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="mt-5 flex justify-between gap-4 border-t border-muted/20 pt-5 text-section-title font-bold"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
              </dl>
              <p className="mt-4 text-caption text-muted">No additional charges in this demo.</p>
              <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-sm text-body font-semibold text-accent hover:underline">Continue shopping</Link>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
