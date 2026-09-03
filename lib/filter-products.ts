import type { Category, Product } from "@/types/product";

export type FilterCategory = Category | "all";

export interface ProductFilters {
  readonly category: FilterCategory;
  readonly maxPrice: number;
  readonly query: string;
}

export const MIN_PRICE = 0;
export const MAX_PRICE = 1000;

export const DEFAULT_FILTERS: ProductFilters = {
  category: "all",
  maxPrice: MAX_PRICE,
  query: "",
};

/** Inclusive price bounds; all active filters must match. Never changes its inputs. */
export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  const query = filters.query.trim().toLowerCase();

  return products.filter(
    (product) =>
      (filters.category === "all" || product.category === filters.category) &&
      product.price >= MIN_PRICE &&
      product.price <= filters.maxPrice &&
      product.title.toLowerCase().includes(query),
  );
}
