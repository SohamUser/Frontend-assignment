import assert from "node:assert/strict";
import test from "node:test";
import { addCartLine, cartSummary, decrementCartLine, removeCartLine, validateCartLines, validQuantity } from "../lib/cart";
import { cartReducer, INITIAL_CART } from "../lib/cart-reducer";
import { CART_STORAGE_KEY, persistCart, readSavedCart, type CartStorage } from "../lib/cart-storage";

function memoryStorage(raw: string | null = null) {
  const writes: { key: string; value: string }[] = [];
  const storage: CartStorage = {
    getItem: (key) => { assert.equal(key, CART_STORAGE_KEY); return raw; },
    setItem: (key, value) => { writes.push({ key, value }); raw = value; },
  };
  return { storage, writes };
}

test("repeated additions merge by ID and totals use catalog prices", () => {
  let lines = addCartLine([], "running-shoes", 1);
  lines = addCartLine(lines, "running-shoes", 1);
  lines = addCartLine(lines, "smartphone", 3);
  assert.deepEqual(lines, [{ productId: "running-shoes", quantity: 2 }, { productId: "smartphone", quantity: 3 }]);
  const summary = cartSummary(lines);
  assert.equal(summary.totalQuantity, 5);
  assert.equal(summary.subtotal, 2295);
  assert.deepEqual(summary.items.map((item) => item.lineTotalCents), [19800, 209700]);
});

test("decrement stops at one and only explicit remove deletes a line", () => {
  const original = [{ productId: "running-shoes", quantity: 2 }];
  const decreased = decrementCartLine(original, "running-shoes");
  assert.equal(decreased[0].quantity, 1);
  assert.equal(decrementCartLine(decreased, "running-shoes"), decreased);
  assert.deepEqual(removeCartLine(decreased, "running-shoes"), []);
  assert.equal(original[0].quantity, 2);
});

test("validation discards unknown IDs, nonpositive/fractional/unsafe quantities and forged prices", () => {
  const lines = validateCartLines([
    null, [], "x", {}, { productId: "unknown", quantity: 2 },
    ...[0, -1, 1.5, "2", null, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1].map((quantity) => ({ productId: "smartphone", quantity })),
    { productId: "running-shoes", quantity: 2, price: 0, title: "Forged" },
    { productId: "running-shoes", quantity: 3 },
  ]);
  assert.deepEqual(lines, [{ productId: "running-shoes", quantity: 5 }]);
  assert.equal(cartSummary(lines).subtotal, 495);
  assert.equal(cartSummary(lines).items[0].product.title, "Running Shoes");
});

test("numerical overflow is rejected without losing valid lines", () => {
  const lines = addCartLine([], "smartphone", 1);
  assert.equal(addCartLine(lines, "smartphone", Number.MAX_SAFE_INTEGER), lines);
  assert.equal(addCartLine(lines, "unknown", 1), lines);
  assert.equal(validQuantity(1), true);
  assert.equal(validQuantity(0), false);
});

test("storage is never read or written by persistence before hydration", () => {
  assert.equal(persistCart(() => { throw new Error("must not access storage"); }, [], false), false);
  const memory = memoryStorage('[{"productId":"backpack","quantity":2}]');
  persistCart(() => memory.storage, [], false);
  assert.equal(memory.writes.length, 0);
  const saved = readSavedCart(() => memory.storage);
  assert.deepEqual(saved.lines, [{ productId: "backpack", quantity: 2 }]);
  assert.equal(memory.writes.length, 0);
  persistCart(() => memory.storage, saved.lines, true);
  assert.equal(memory.writes[0].value, '[{"productId":"backpack","quantity":2}]');
});

test("persisted payload contains only IDs and quantities and restores after reload", () => {
  const memory = memoryStorage();
  const lines = [{ productId: "t-shirt", quantity: 4, price: 1 }];
  assert.equal(persistCart(() => memory.storage, lines, true), true);
  assert.deepEqual(JSON.parse(memory.writes[0].value), [{ productId: "t-shirt", quantity: 4 }]);
  const reloaded = readSavedCart(() => memory.storage);
  assert.equal(cartSummary(reloaded.lines).subtotal, 116);
});

for (const raw of ["broken-json", "null", "{}", "42", '"string"']) {
  test(`corrupt storage safely recovers: ${raw}`, () => {
    const memory = memoryStorage(raw);
    const saved = readSavedCart(() => memory.storage);
    assert.deepEqual(saved.lines, []);
    assert.ok(saved.storageWarning);
    assert.equal(saved.storageAvailable, true);
  });
}

test("storage access, read, and quota errors never throw", () => {
  const getterFailure = () => { throw new Error("SecurityError"); };
  const blocked = { getItem: () => { throw new Error("read blocked"); }, setItem: () => { throw new Error("QuotaExceededError"); } };
  assert.equal(readSavedCart(getterFailure).storageAvailable, false);
  assert.equal(readSavedCart(() => blocked).storageAvailable, false);
  assert.equal(persistCart(getterFailure, [], true), false);
  assert.equal(persistCart(() => blocked, [], true), false);
});

test("hydration is idempotent and actions cannot overwrite a cart before it loads", () => {
  assert.equal(cartReducer(INITIAL_CART, { type: "add", productId: "smartphone", quantity: 1 }), INITIAL_CART);
  let state = cartReducer(INITIAL_CART, { type: "hydrate", saved: { lines: [{ productId: "backpack", quantity: 2 }], storageAvailable: true, storageWarning: "" } });
  state = cartReducer(state, { type: "add", productId: "backpack", quantity: 1 });
  const again = cartReducer(state, { type: "hydrate", saved: { lines: [], storageAvailable: true, storageWarning: "" } });
  assert.equal(again, state);
  assert.equal(again.lines[0].quantity, 3);
});

test("all context actions and repeated-add announcements update correctly", () => {
  let state = cartReducer(INITIAL_CART, { type: "hydrate", saved: { lines: [], storageAvailable: true, storageWarning: "" } });
  state = cartReducer(state, { type: "add", productId: "smartphone", quantity: 3 });
  const firstAnnouncement = state.announcementId;
  state = cartReducer(state, { type: "add", productId: "smartphone", quantity: 3 });
  assert.equal(state.lines[0].quantity, 6);
  assert.ok(state.message.includes("6 items"));
  assert.ok(state.announcementId > firstAnnouncement);
  state = cartReducer(state, { type: "increment", productId: "smartphone" });
  state = cartReducer(state, { type: "decrement", productId: "smartphone" });
  assert.equal(state.lines[0].quantity, 6);
  state = cartReducer(state, { type: "remove", productId: "smartphone" });
  assert.equal(cartSummary(state.lines).subtotal, 0);
  assert.equal(cartSummary(state.lines).totalQuantity, 0);
  state = cartReducer(state, { type: "dismiss" });
  assert.equal(state.message, "");
});

test("cart continues in memory when saving is unavailable", () => {
  let state = cartReducer(INITIAL_CART, { type: "hydrate", saved: { lines: [], storageAvailable: false, storageWarning: "blocked" } });
  state = cartReducer(state, { type: "add", productId: "table-lamp", quantity: 2 });
  assert.equal(cartSummary(state.lines).subtotal, 178);
  state = cartReducer(state, { type: "storage-failed" });
  assert.equal(state.lines[0].quantity, 2);
  assert.equal(state.storageAvailable, false);
});
