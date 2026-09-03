import Link from "next/link";
import { UserRound } from "lucide-react";
import { CartLink } from "@/components/cart/cart-link";
import { PageContainer } from "@/components/layout/page-container";
import { ProductSearch } from "@/components/products/product-search";

export function SiteHeader() {
  return (
    <header className="bg-navy text-white">
      <PageContainer className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,2fr)_minmax(0,1fr)] md:gap-x-8 md:py-5">
        <Link
          href="/"
          aria-label="WhatBytes Store home"
          className="w-fit rounded-sm text-[1.375rem] leading-tight font-bold tracking-tight sm:text-2xl"
        >
          WhatBytes
        </Link>
        <ProductSearch />
        <nav aria-label="Store navigation" className="flex items-center justify-end gap-3 md:col-start-3">
          <CartLink />
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10">
            <UserRound size={19} strokeWidth={1.75} />
          </span>
        </nav>
      </PageContainer>
    </header>
  );
}
