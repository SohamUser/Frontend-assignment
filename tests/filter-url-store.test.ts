import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_FILTERS } from "../lib/filter-products";
import { type FilterLocation } from "../lib/filter-url";
import { FilterUrlStore } from "../lib/filter-url-store";

function location(href: string): FilterLocation {
  const url = new URL(href, "https://store.test");
  return { pathname: url.pathname, search: url.search.slice(1) };
}

function setup(href = "/") {
  let actual = location(href);
  let now = 0;
  const jobs = new Set<{ at: number; callback: () => void }>();
  const writes: string[] = [];
  const store = new FilterUrlStore(actual, {
    replace: (target) => { writes.push(target); },
    readLocation: () => actual,
    schedule: (callback, delay) => {
      const job = { at: now + delay, callback };
      jobs.add(job);
      return () => { jobs.delete(job); };
    },
  });
  store.observe(actual);
  return {
    store, writes,
    tick(ms: number) {
      now += ms;
      for (const job of [...jobs]) {
        if (job.at <= now) { jobs.delete(job); job.callback(); }
      }
    },
    navigate(target: string) { actual = location(target); store.observe(actual); },
    pop(target: string) { actual = location(target); store.restore(actual); store.observe(actual); },
    moveAddressOnly(target: string) { actual = location(target); },
  };
}

test("direct-link state and canonical defaults initialize without loops", () => {
  const t = setup("/?category=electronics&price=0-1000&q=phone&keep=x");
  assert.deepEqual(t.store.getSnapshot(), { category: "electronics", maxPrice: 1000, query: "phone" });
  assert.deepEqual(t.writes, ["/?keep=x&category=electronics&q=phone"]);
  t.navigate(t.writes[0]);
  t.navigate(t.writes[0]);
  assert.equal(t.writes.length, 1);
});

test("search publishes immediately, writes at 300ms, and retains raw typing on acknowledgement", () => {
  const t = setup();
  t.store.setQuery("  phone  ");
  assert.equal(t.store.getSnapshot().query, "  phone  ");
  t.tick(299);
  assert.equal(t.writes.length, 0);
  t.tick(1);
  assert.deepEqual(t.writes, ["/?q=phone"]);
  t.navigate(t.writes[0]);
  assert.equal(t.store.getSnapshot().query, "  phone  ");
});

test("new typing restarts the debounce", () => {
  const t = setup();
  t.store.setQuery("p"); t.tick(200);
  t.store.setQuery("phone"); t.tick(299);
  assert.equal(t.writes.length, 0);
  t.tick(1);
  assert.deepEqual(t.writes, ["/?q=phone"]);
});

test("rapid category and price changes coalesce without old acknowledgements restoring stale controls", () => {
  const t = setup("/?keep=x");
  t.store.setCategory("electronics");
  t.store.setMaxPrice(199);
  t.store.setCategory("home");
  t.store.setMaxPrice(89);
  assert.equal(t.writes.length, 1);
  t.navigate(t.writes[0]);
  assert.deepEqual(t.store.getSnapshot(), { category: "home", maxPrice: 89, query: "" });
  assert.equal(t.writes[1], "/?keep=x&category=home&price=0-89");
  t.navigate(t.writes[1]);
  assert.equal(t.writes.length, 2);
});

test("category updates do not prematurely flush search; the debounce uses the latest full draft", () => {
  const t = setup();
  t.store.setQuery("phone"); t.tick(100);
  t.store.setCategory("electronics");
  assert.equal(t.writes[0], "/?category=electronics");
  t.store.setMaxPrice(199);
  t.navigate(t.writes[0]);
  t.tick(200);
  t.navigate(t.writes[1]);
  assert.equal(t.writes[2], "/?category=electronics&price=0-199&q=phone");
});

test("clear cancels pending search and clears an in-flight write after its acknowledgement", () => {
  const t = setup("/?keep=x");
  t.store.setCategory("electronics");
  t.store.setQuery("phone");
  t.store.clearFilters();
  t.tick(1000);
  assert.deepEqual(t.store.getSnapshot(), DEFAULT_FILTERS);
  t.navigate(t.writes[0]);
  assert.equal(t.writes[1], "/?keep=x");
  t.navigate(t.writes[1]);
  assert.equal(t.writes.length, 2);
});

test("external navigation discards queued filters and debounce", () => {
  const t = setup();
  t.store.setCategory("electronics");
  t.store.setMaxPrice(99);
  t.store.setQuery("phone");
  t.store.beginNavigation();
  t.navigate("/?category=home&q=lamp");
  t.tick(1000);
  assert.deepEqual(t.store.getSnapshot(), { category: "home", maxPrice: 1000, query: "lamp" });
  assert.equal(t.writes.length, 1);
});

test("back/forward and same-URL popstate restore controls and cancel pending search", () => {
  const t = setup("/?q=lamp");
  t.store.setQuery("phone");
  t.pop("/?q=lamp"); t.tick(1000);
  assert.equal(t.store.getSnapshot().query, "lamp");
  t.pop("/?category=clothing&price=0-99");
  assert.deepEqual(t.store.getSnapshot(), { category: "clothing", maxPrice: 99, query: "" });
  t.pop("/?q=lamp");
  assert.equal(t.store.getSnapshot().query, "lamp");
  assert.equal(t.writes.length, 0);
});

test("a changed address before route observation prevents a stale timeout from navigating", () => {
  const t = setup();
  t.store.setQuery("phone");
  t.moveAddressOnly("/cart?keep=x");
  t.tick(300);
  assert.equal(t.writes.length, 0);
  assert.equal(t.store.getSnapshot().query, "");
});

test("off-home typing stays local until explicit submission", () => {
  for (const path of ["/cart", "/product/smartphone"]) {
    const t = setup(`${path}?keep=x`);
    t.store.setQuery("  phone  "); t.tick(1000);
    assert.equal(t.writes.length, 0);
    t.store.submitSearch();
    assert.deepEqual(t.writes, ["/?keep=x&q=phone"]);
    t.navigate(t.writes[0]);
    assert.equal(t.store.getSnapshot().query, "  phone  ");
  }
});

test("submit flushes immediately and dispose cancels outstanding search", () => {
  const t = setup();
  t.store.setQuery("phone"); t.store.submitSearch();
  assert.deepEqual(t.writes, ["/?q=phone"]);
  t.navigate(t.writes[0]);
  t.store.setQuery("lamp"); t.store.dispose(); t.tick(1000);
  assert.equal(t.writes.length, 1);
});
