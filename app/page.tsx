import { ProductListing } from "@/components/products/product-listing";
import { products } from "@/data/products";
import { pageMetadata, serializeJsonLd, siteDescription, siteName, siteUrl } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("Electronics, Clothing & Home Essentials", siteDescription, "/"),
  title: { absolute: `WhatBytes Store | Electronics, Clothing & Home Essentials` },
};

export default function Home() {
  return (
    <>
      {siteUrl && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl.href,
      }) }} />}
      <ProductListing products={products} />
    </>
  );
}
