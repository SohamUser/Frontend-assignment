import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { products } from "@/data/products";
import { getProductById } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

// This local catalog is complete; unknown IDs should return an HTTP 404 before streaming.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return pageMetadata(product.title, product.description, `/product/${product.id}`, product.image);
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
