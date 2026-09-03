import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/products/star-rating";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  preloadImage?: boolean;
}

export function ProductCard({ product, preloadImage = false }: ProductCardProps) {
  const href = `/product/${product.id}`;
  const featured = product.featured;

  return (
    <article
      aria-labelledby={`product-${product.id}`}
      className={`flex h-full min-w-0 flex-col rounded-xl bg-white p-4 shadow-sm ${
        featured ? "md:grid md:grid-cols-2 md:gap-5 md:p-5" : ""
      }`}
    >
      <Link
        href={href}
        prefetch={false}
        className={`relative block aspect-square rounded-lg ${
          featured ? "md:aspect-auto md:min-h-64" : ""
        }`}
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          preload={preloadImage}
          sizes={
            featured
              ? "(min-width: 1280px) 275px, (min-width: 1024px) 22vw, (min-width: 768px) 43vw, (min-width: 640px) calc(100vw - 96px), calc(100vw - 72px)"
              : "(min-width: 1280px) 245px, (min-width: 1024px) 21vw, (min-width: 768px) calc((100vw - 152px) / 2), (min-width: 640px) calc(100vw - 96px), calc(100vw - 72px)"
          }
          className="object-contain"
        />
      </Link>
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? "pt-4 md:pt-0" : "pt-3"}`}>
        <h2
          id={`product-${product.id}`}
          className={`${featured ? "text-section-title" : "text-body"} font-semibold leading-snug`}
        >
          <Link href={href} prefetch={false} className="rounded-sm hover:underline">
            {product.title}
          </Link>
        </h2>
        <p className="mt-1 text-section-title font-bold">{formatPrice(product.price)}</p>
        <div className="mt-2 flex">
          <StarRating rating={product.rating} />
        </div>
        {featured ? (
          <>
            <p className="mt-4 text-body text-muted">{product.description}</p>
            <dl className="mt-4 text-caption">
              <dt className="font-semibold">Category</dt>
              <dd className="mt-1 capitalize text-muted">{product.category}</dd>
            </dl>
          </>
        ) : null}
        <div className="mt-auto pt-4">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
