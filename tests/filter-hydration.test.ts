import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { JSDOM } from "jsdom";
import { AppRouterContext, type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext, SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { ProductFiltersProvider, useProductFilters } from "../context/product-filters-context";
import { products } from "../data/products";
import { filterProducts } from "../lib/filter-products";

test("catalog renders on the server and direct query filters hydrate without mismatches", async () => {
  function Catalog() {
    const { filters } = useProductFilters();
    return createElement("ul", null, filterProducts(products, filters).map((product) =>
      createElement("li", { key: product.id }, product.title)));
  }
  const search = "q=phone&category=electronics&price=0-200";
  const router = { replace() {} } as unknown as AppRouterInstance;
  const tree = createElement(AppRouterContext.Provider, { value: router },
    createElement(PathnameContext.Provider, { value: "/" },
      createElement(SearchParamsContext.Provider, { value: new URLSearchParams(search) },
        createElement(ProductFiltersProvider, null, createElement(Catalog)))));
  const html = renderToString(tree);
  const dom = new JSDOM(`<div id="root">${html}</div>`, { url: `http://localhost/?${search}` });
  const container = dom.window.document.getElementById("root")!;
  assert.equal(container.querySelectorAll("li").length, products.length);
  const globals = { window: dom.window, self: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = new Map(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, tree, { onRecoverableError: (error) => errors.push(error) }); });
    assert.deepEqual(errors, []);
    assert.deepEqual(Array.from(container.querySelectorAll("li"), (item) => item.textContent), ["Wireless Headphones"]);
  } finally {
    await act(async () => root?.unmount());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
