import Image from "next/image";
import Link from "next/link";
import { ProductPurchaseControls } from "@/components/products/product-purchase-controls";
import { StarRating } from "@/components/products/star-rating";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types/product";

export function ProductDetail({ product }: { product: Product }) {
  return (
    <div>
      <Link href="/" className="mb-6 inline-flex min-h-11 items-center rounded-sm text-body font-semibold text-accent hover:underline">
        Back to products
      </Link>
      <article aria-labelledby="product-title" className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square rounded-xl bg-white">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            preload
            sizes="(min-width: 1280px) 576px, (min-width: 768px) 46vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            className="rounded-xl object-contain p-5 sm:p-8"
          />
        </div>
        <div className="min-w-0 md:py-3 lg:py-6">
          <h1 id="product-title" className="text-page-title font-bold text-navy">
            {product.title}
          </h1>
          <p className="mt-3 text-page-title font-bold">{formatPrice(product.price)}</p>
          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span aria-hidden="true" className="text-caption text-muted">{product.rating} / 5</span>
          </div>
          <p className="mt-6 max-w-prose text-body text-muted">{product.description}</p>
          <dl className="mt-5 text-body">
            <dt className="font-semibold">Category</dt>
            <dd className="mt-1 capitalize text-muted">{product.category}</dd>
          </dl>
          <ProductPurchaseControls key={product.id} productId={product.id} />
        </div>
      </article>
    </div>
  );
}
