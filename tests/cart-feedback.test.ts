import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { CartProvider, useCart } from "../context/cart-context";
import { CartFeedback } from "../components/cart/cart-feedback";

test("cart feedback expires, restarts for identical updates, and supports manual dismissal", async (t) => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  const globals = { window: dom.window, self: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = new Map(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const container = dom.window.document.getElementById("root")!;
  const root = createRoot(container);
  let cart!: ReturnType<typeof useCart>;
  function Feedback() {
    cart = useCart();
    return createElement(CartFeedback);
  }
  const notification = () => container.querySelector('[role="status"]')!.textContent;

  try {
    await act(async () => root.render(createElement(CartProvider, null, createElement(Feedback))));
    await act(async () => cart.add("smartphone"));
    assert.match(notification(), /Added/);
    await act(async () => t.mock.timers.tick(2999));
    assert.match(notification(), /Added/);
    await act(async () => t.mock.timers.tick(1));
    assert.equal(notification(), "");
    assert.equal(cart.totalQuantity, 1, "dismissing feedback must preserve the cart");

    await act(async () => cart.increment("smartphone"));
    const repeatedMessage = notification();
    await act(async () => t.mock.timers.tick(2000));
    await act(async () => cart.increment("smartphone"));
    assert.equal(notification(), repeatedMessage);
    await act(async () => t.mock.timers.tick(1000));
    assert.equal(notification(), repeatedMessage, "the previous timer must not close new feedback");
    await act(async () => t.mock.timers.tick(1999));
    assert.equal(notification(), repeatedMessage);
    await act(async () => t.mock.timers.tick(1));
    assert.equal(notification(), "");

    await act(async () => cart.add("smartphone"));
    await act(async () => t.mock.timers.tick(1000));
    await act(async () => container.querySelector<HTMLButtonElement>('button[aria-label="Dismiss cart notification"]')!.click());
    assert.equal(notification(), "");
    await act(async () => cart.add("smartphone"));
    await act(async () => t.mock.timers.tick(2000));
    assert.match(notification(), /Added/, "manual dismissal must cancel the old timer");
    await act(async () => t.mock.timers.tick(1000));
    assert.equal(notification(), "");
  } finally {
    await act(async () => root.unmount());
    t.mock.timers.reset();
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
