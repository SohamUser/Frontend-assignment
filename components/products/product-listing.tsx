"use client";

import { FilterSidebar } from "@/components/products/filter-sidebar";
import { ProductGrid } from "@/components/products/product-grid";
import { useProductFilters } from "@/context/product-filters-context";
import { filterProducts } from "@/lib/filter-products";
import type { Product } from "@/types/product";

export function ProductListing({ products }: { products: readonly Product[] }) {
  const { filters, setCategory, setMaxPrice, clearFilters } = useProductFilters();
  const visibleProducts = filterProducts(products, filters);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      <FilterSidebar
        filters={filters}
        onCategoryChange={setCategory}
        onMaxPriceChange={setMaxPrice}
        onClear={clearFilters}
      />
      <section aria-labelledby="product-listing-heading" className="min-w-0">
        <h1 id="product-listing-heading" className="mb-4 text-page-title font-bold text-navy">
          Product Listing
        </h1>
        <p role="status" aria-atomic="true" className="sr-only">
          {visibleProducts.length === 0
            ? "0 products found"
            : `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"} found`}
        </p>
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <p className="rounded-xl bg-white px-6 py-16 text-center text-body text-muted">
            No products found. Try adjusting your filters.
          </p>
        )}
      </section>
    </div>
  );
}
