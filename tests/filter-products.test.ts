import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../data/products";
import { DEFAULT_FILTERS, filterProducts, type ProductFilters } from "../lib/filter-products";

const matchingIds = (overrides: Partial<ProductFilters> = {}) =>
  filterProducts(products, { ...DEFAULT_FILTERS, ...overrides }).map((product) => product.id);

test("defaults show the full catalog in its original order", () => {
  assert.deepEqual(matchingIds(), products.map((product) => product.id));
});

for (const [category, expected] of [
  ["electronics", ["wireless-headphones", "smartwatch", "digital-camera", "smartphone"]],
  ["clothing", ["running-shoes", "backpack", "sunglasses", "t-shirt"]],
  ["home", ["table-lamp", "coffee-maker"]],
] as const) {
  test(`category: ${category}`, () => {
    assert.deepEqual(matchingIds({ category }), expected);
  });
}

test("search is case-insensitive, trims surrounding whitespace, and matches substrings", () => {
  assert.deepEqual(matchingIds({ query: "  pHoNe  " }), ["wireless-headphones", "smartphone"]);
});

test("empty or whitespace-only search imposes no restriction", () => {
  assert.deepEqual(matchingIds({ query: " \t\n " }), matchingIds());
});

test("search uses titles only, not descriptions or categories", () => {
  assert.deepEqual(matchingIds({ query: "electronics" }), []);
  assert.deepEqual(matchingIds({ query: "edge-to-edge" }), []);
});

test("search is literal rather than a regular expression", () => {
  assert.deepEqual(matchingIds({ query: ".*" }), []);
});

for (const product of products) {
  test(`price boundary: ${product.title} is included at $${product.price}, excluded one dollar below`, () => {
    assert.ok(matchingIds({ maxPrice: product.price }).includes(product.id));
    assert.ok(!matchingIds({ maxPrice: product.price - 1 }).includes(product.id));
  });
}

test("price endpoints: $0 returns no catalog items and $1000 returns all", () => {
  assert.deepEqual(matchingIds({ maxPrice: 0 }), []);
  assert.deepEqual(matchingIds({ maxPrice: 1000 }), matchingIds());
});

test("both price bounds are inclusive, including a zero-priced item", () => {
  const fixture = [-1, 0, 1000, 1001].map((price) => ({ ...products[0], id: String(price), price }));
  assert.deepEqual(filterProducts(fixture, DEFAULT_FILTERS).map((product) => product.price), [0, 1000]);
  assert.deepEqual(filterProducts(fixture, { ...DEFAULT_FILTERS, maxPrice: 0 }).map((product) => product.price), [0]);
});

test("category and price combine", () => {
  assert.deepEqual(matchingIds({ category: "home", maxPrice: 100 }), ["table-lamp"]);
});

test("all three filters use AND logic", () => {
  assert.deepEqual(matchingIds({ category: "electronics", maxPrice: 199, query: " PHONE " }), ["wireless-headphones"]);
  assert.deepEqual(matchingIds({ category: "clothing", maxPrice: 199, query: " PHONE " }), []);
  assert.deepEqual(matchingIds({ category: "electronics", maxPrice: 198, query: " PHONE " }), []);
});

test("an unmatched search or empty catalog yields no products", () => {
  assert.deepEqual(matchingIds({ query: "no-such-product" }), []);
  assert.deepEqual(filterProducts([], DEFAULT_FILTERS), []);
});

test("filtering does not mutate raw search, filters, catalog order, or products", () => {
  const catalog = Object.freeze(products.map((product) => Object.freeze({ ...product })));
  const filters = Object.freeze({ ...DEFAULT_FILTERS, query: "  PHONE  " });
  const before = JSON.stringify(catalog);
  filterProducts(catalog, filters);
  assert.equal(filters.query, "  PHONE  ");
  assert.equal(JSON.stringify(catalog), before);
});
