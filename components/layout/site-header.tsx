import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { CartLink } from "@/components/cart/cart-link";
import { PageContainer } from "@/components/layout/page-container";
import { ProductSearch } from "@/components/products/product-search";

export function SiteHeader() {
  return (
    <header className="bg-navy text-white">
      <PageContainer className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-8 md:py-5 lg:gap-x-12">
        <Link
          href="/"
          aria-label="WhatBytes Store home"
          className="flex min-h-11 w-fit items-center gap-1.5 rounded-sm text-xl leading-tight font-bold tracking-tight sm:gap-2 sm:text-2xl"
        >
          <Image src="/brand/whatbytes-mark.png" alt="" width={36} height={36} className="size-8 shrink-0 sm:size-9" unoptimized />
          <span>WhatBytes</span>
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
