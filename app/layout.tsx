import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductFiltersProvider } from "@/context/product-filters-context";
import { CartProvider } from "@/context/cart-context";
import { CartFeedback } from "@/components/cart/cart-feedback";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WhatBytes Store",
    template: "%s | WhatBytes Store",
  },
  description:
    "WhatBytes Store is a demo storefront for electronics, clothing, and home essentials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <Suspense
            fallback={
              <main id="main-content" tabIndex={-1} className="min-h-96 flex-1 py-8 md:py-10">
                <PageContainer><p role="status">Loading storefront...</p></PageContainer>
              </main>
            }
          >
            <ProductFiltersProvider>
              <SiteHeader />
              <main id="main-content" tabIndex={-1} className="min-h-96 flex-1 py-8 md:py-10">
                <PageContainer>{children}</PageContainer>
              </main>
            </ProductFiltersProvider>
          </Suspense>
          <CartFeedback />
        </CartProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
