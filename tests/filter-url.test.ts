import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_FILTERS } from "../lib/filter-products";
import { homeSearchLocation, readFilterParams, writeFilterParams } from "../lib/filter-url";

test("direct links parse all three controls", () => {
  assert.deepEqual(readFilterParams(new URLSearchParams("category=electronics&price=0-199&q=phone")), {
    category: "electronics", maxPrice: 199, query: "phone",
  });
});

test("missing values and invalid categories fall back to defaults", () => {
  for (const category of ["", "all", "invalid", "Electronics", "electronics,home"]) {
    assert.deepEqual(readFilterParams(new URLSearchParams({ category })), DEFAULT_FILTERS);
  }
});

for (const price of ["", "500", "1-500", "0-", "0-nope", "0-NaN", "0-Infinity", "0-0xFF", "0-10-20", " 0-100", "0-100junk"]) {
  test(`malformed price defaults to 1000: ${JSON.stringify(price)}`, () => {
    assert.equal(readFilterParams(new URLSearchParams({ price })).maxPrice, 1000);
  });
}

for (const [price, expected] of [["0-0", 0], ["0-199", 199], ["0-1000", 1000], ["0-1200", 1000], ["0--12", 0], ["0-99.5", 99.5], ["0-.5", 0.5], ["0-1e-7", 1e-7], ["0-1e999", 1000], ["0--1e999", 0]] as const) {
  test(`valid numeric bound clamps: ${price}`, () => {
    assert.equal(readFilterParams(new URLSearchParams({ price })).maxPrice, expected);
  });
}

test("serialization removes defaults and empty search while preserving unrelated repeated keys", () => {
  assert.equal(writeFilterParams("campaign=one&tag=a&tag=b&category=all&price=0-1000&q=x", DEFAULT_FILTERS), "campaign=one&tag=a&tag=b");
  assert.equal(writeFilterParams("q=x", { ...DEFAULT_FILTERS, query: " \t " }), "");
});

test("search is encoded safely and only normalized for the URL", () => {
  const filters = { ...DEFAULT_FILTERS, query: "  phone & lamp + café  " };
  const result = writeFilterParams("utm=a", filters);
  assert.equal(new URLSearchParams(result).get("q"), "phone & lamp + café");
  assert.equal(filters.query, "  phone & lamp + café  ");
});

test("canonical serialization is stable and collapses duplicate filter keys", () => {
  for (const search of ["category=bad&price=0-2000&q=", "q=a&q=b&category=home&category=clothing&keep=1", "price=0-1e-7"]) {
    const canonical = writeFilterParams(search, readFilterParams(new URLSearchParams(search)));
    assert.equal(writeFilterParams(canonical, readFilterParams(new URLSearchParams(canonical))), canonical);
  }
});

test("off-home search targets home without retaining invisible category/price constraints", () => {
  assert.deepEqual(homeSearchLocation("coupon=SAVE&category=home&price=0-20", "phone"), {
    pathname: "/", search: "coupon=SAVE&q=phone",
  });
});
