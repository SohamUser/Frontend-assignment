import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CartProvider } from "../context/cart-context";
import { CartContents } from "../components/cart/cart-contents";
import { AddToCartButton } from "../components/cart/add-to-cart-button";
import { CartLink } from "../components/cart/cart-link";

test("server render shows hydration placeholders, not a misleading empty cart", () => {
  const html = renderToStaticMarkup(createElement(CartProvider, null, createElement(CartContents)));
  assert.ok(html.includes("Loading your saved cart..."));
  assert.ok(!html.includes("Your cart is empty"));
});

test("add buttons stay disabled and badge stays loading until client hydration", () => {
  const html = renderToStaticMarkup(createElement(CartProvider, null,
    createElement(AddToCartButton, { productId: "smartphone" }), createElement(CartLink)));
  assert.ok(html.includes('disabled=""'));
  assert.ok(html.includes("Loading cart..."));
  assert.ok(html.includes('aria-label="Cart, loading"'));
});
