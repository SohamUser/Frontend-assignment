import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      {/* Reserve the desktop sidebar column for the later filters phase. */}
      <div aria-hidden="true" className="hidden lg:block" />
      <section aria-labelledby="product-listing-heading" className="min-w-0">
        <h1
          id="product-listing-heading"
          className="mb-5 text-page-title font-bold text-navy"
        >
          Product Listing
        </h1>
        <p id="cart-unavailable" className="mb-5 text-caption text-muted">
          Browsing preview. Adding items to the cart is not available yet.
        </p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
