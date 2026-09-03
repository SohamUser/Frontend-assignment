import type { Metadata, MetadataRoute } from "next";
import { products } from "@/data/products";
import type { Product } from "@/types/product";

export const siteName = "WhatBytes Store";
export const siteDescription =
  "Explore electronics, clothing, and home essentials at WhatBytes Store, a demo storefront with product search, filters, and a persistent cart.";

/** Set the public origin before building for an indexable deployment. */
export function resolveSiteUrl(value: string | undefined): URL | null {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.");
  }
  return url;
}

export const siteUrl = resolveSiteUrl(
  process.env.SITE_URL ?? "https://frontend-assignment-nine-gamma.vercel.app",
);

export function pageMetadata(title: string, description: string, path: string, image = "/og"): Metadata {
  return {
    title,
    description,
    ...(siteUrl ? { alternates: { canonical: new URL(path, siteUrl).href } } : {}),
    openGraph: {
      type: "website", siteName, locale: "en_US", title: `${title} | ${siteName}`, description,
      ...(siteUrl ? { url: new URL(path, siteUrl).href } : {}),
      images: [{ url: image, alt: image === "/og" ? siteName : title,
        ...(image === "/og" ? { width: 1200, height: 630 } : {}) }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteName}`, description, images: [image] },
  };
}

export function createSitemap(origin: URL | null): MetadataRoute.Sitemap {
  if (!origin) return [];
  return ["/", ...products.map(({ id }) => `/product/${id}`)].map((path) => ({
    url: new URL(path, origin).href,
  }));
}

export function createRobots(origin: URL | null): MetadataRoute.Robots {
  return origin
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", origin).href }
    : { rules: { userAgent: "*", disallow: "/" } };
}

export function productStructuredData(product: Product, origin: URL | null = siteUrl) {
  const absolute = (path: string) => origin ? new URL(path, origin).href : path;
  const url = absolute(`/product/${product.id}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product", name: product.title, description: product.description,
        image: absolute(product.image), category: product.category, sku: product.id, url,
        // The catalog is illustrative: there are no real offers or verified customer reviews.
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Products", item: absolute("/") },
          { "@type": "ListItem", position: 2, name: product.title, item: url },
        ],
      },
    ],
  };
}

/** Prevent catalog text from ending the JSON-LD script element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
