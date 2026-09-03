import assert from "node:assert/strict";
import test from "node:test";
import ProductPage, { dynamicParams, generateMetadata, generateStaticParams } from "../app/product/[id]/page";
import { products } from "../data/products";
import { getProductById } from "../lib/catalog";

const props = (id: string) => ({ params: Promise.resolve({ id }), searchParams: Promise.resolve({}) });

test("static params include every catalog ID exactly once", () => {
  assert.equal(dynamicParams, false);
  const params = generateStaticParams();
  assert.deepEqual(params, products.map(({ id }) => ({ id })));
  assert.equal(new Set(params.map(({ id }) => id)).size, products.length);
});

for (const product of products) {
  test(`server route and metadata use catalog data: ${product.id}`, async () => {
    assert.equal(getProductById(product.id), product);
    const page = await ProductPage(props(product.id));
    assert.equal(page.props.product, product);
    const metadata = await generateMetadata(props(product.id));
    assert.equal(metadata.title, product.title);
    assert.equal(metadata.description, product.description);
    assert.equal(metadata.openGraph?.title, `${product.title} | WhatBytes Store`);
    assert.deepEqual(metadata.twitter?.images, [product.image]);
  });
}

for (const id of ["unknown-product", "SMARTPHONE", "", "__proto__"]) {
  test(`unknown ID uses Next's notFound boundary: ${JSON.stringify(id)}`, async () => {
    assert.equal(getProductById(id), undefined);
    const isNotFound = (error: unknown) =>
      error instanceof Error && "digest" in error && error.digest === "NEXT_HTTP_ERROR_FALLBACK;404";
    await assert.rejects(ProductPage(props(id)), isNotFound);
    await assert.rejects(generateMetadata(props(id)), isNotFound);
  });
}
