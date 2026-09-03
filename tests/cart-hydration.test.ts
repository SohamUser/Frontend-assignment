import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, Suspense } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { JSDOM } from "jsdom";
import { CartProvider } from "../context/cart-context";
import { CartLink } from "../components/cart/cart-link";
import { CART_STORAGE_KEY } from "../lib/cart-storage";

test("saved cart restoration preserves server HTML across delayed Suspense hydration", async () => {
  let delayHydration = false;
  let resumeHydration!: () => void;
  const pending = new Promise<void>((resolve) => { resumeHydration = resolve; });
  function DelayedHeader() {
    if (delayHydration) throw pending;
    return createElement(CartLink);
  }
  const tree = createElement(CartProvider, null,
    createElement(Suspense, { fallback: "Loading storefront..." }, createElement(DelayedHeader)));
  const html = renderToString(tree);
  const dom = new JSDOM(`<div id="root">${html}</div>`, { url: "http://localhost" });
  const globals = { window: dom.window, self: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = new Map(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const container = dom.window.document.getElementById("root")!;
  const serverLink = container.querySelector("a");
  const errors: unknown[] = [];
  const saved = JSON.stringify([{ productId: "smartphone", quantity: 3 }]);
  dom.window.localStorage.setItem(CART_STORAGE_KEY, saved);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    assert.equal(serverLink?.getAttribute("aria-label"), "Cart, loading");
    delayHydration = true;
    await act(async () => {
      root = hydrateRoot(container, tree, { onRecoverableError: (error) => errors.push(error) });
    });
    await act(async () => {
      delayHydration = false;
      resumeHydration();
      await pending;
    });
    assert.deepEqual(errors, []);
    assert.equal(container.querySelector("a"), serverLink, "hydration should reuse the server link");
    assert.equal(serverLink?.getAttribute("aria-label"), "Cart, 3 items");
    assert.equal(serverLink?.textContent, "Cart3");
    assert.equal(dom.window.localStorage.getItem(CART_STORAGE_KEY), saved);
  } finally {
    await act(async () => root?.unmount());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
