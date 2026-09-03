import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { products } from "../data/products";
import { createRobots, createSitemap, productStructuredData, resolveSiteUrl, serializeJsonLd } from "../lib/seo";

test("public origin accepts HTTP(S) and rejects unsafe or non-root URLs", () => {
  assert.equal(resolveSiteUrl(" https://store.example ")?.href, "https://store.example/");
  assert.equal(resolveSiteUrl("http://localhost:3000/")?.origin, "http://localhost:3000");
  for (const input of [undefined, "", "  "]) assert.equal(resolveSiteUrl(input), null);
  for (const input of ["not-a-url", "javascript:alert(1)", "ftp://store.example", "https://user:password@store.example", "https://store.example/shop", "https://store.example/?q=x", "https://store.example/#x"]) {
    assert.throws(() => resolveSiteUrl(input));
  }
});

test("sitemap includes the canonical catalog only, with no cart or filter URLs", () => {
  const origin = new URL("https://store.example");
  const urls = createSitemap(origin).map(({ url }) => url);
  assert.equal(urls.length, products.length + 1);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(origin.href));
  for (const product of products) assert.ok(urls.includes(`${origin.origin}/product/${product.id}`));
  assert.ok(urls.every((url) => !url.includes("?") && !url.includes("/cart")));
  assert.deepEqual(createRobots(origin), { rules: { userAgent: "*", allow: "/" }, sitemap: "https://store.example/sitemap.xml" });
});

test("an unconfigured build does not advertise localhost to crawlers", () => {
  assert.deepEqual(createSitemap(null), []);
  assert.deepEqual(createRobots(null), { rules: { userAgent: "*", disallow: "/" } });
});

test("every product schema matches the catalog without invented commerce or review claims", () => {
  for (const product of products) {
    const data = productStructuredData(product, new URL("https://store.example"));
    const [item, breadcrumbs] = data["@graph"];
    assert.equal(item.name, product.title);
    assert.equal(item.description, product.description);
    assert.equal(item.image, `https://store.example${product.image}`);
    assert.equal(item.url, `https://store.example/product/${product.id}`);
    assert.equal("offers" in item, false);
    assert.equal("aggregateRating" in item, false);
    assert.equal(breadcrumbs.itemListElement?.at(-1)?.item, item.url);
  }
});

test("JSON-LD preserves text while preventing script termination", () => {
  const input = { description: '</script><script>alert("x")</script>&' };
  const serialized = serializeJsonLd(input);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), input);
});

test("configured page metadata uses the public origin for home and every product", () => {
  execFileSync(process.execPath, ["--import", "tsx", "--eval", `
    const assert = require('node:assert/strict');
    const { pageMetadata, siteUrl } = require('./lib/seo.ts');
    const { products } = require('./data/products.ts');
    assert.equal(siteUrl.href, 'https://store.example/');
    for (const path of ['/', ...products.map(p => '/product/' + p.id)]) {
      const metadata = pageMetadata('Title', 'Description', path);
      assert.equal(metadata.alternates.canonical, new URL(path, 'https://store.example').href);
      assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
    }
  `], { cwd: process.cwd(), env: { ...process.env, SITE_URL: "https://store.example" }, stdio: "pipe" });
});
