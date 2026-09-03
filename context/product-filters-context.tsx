"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  DEFAULT_FILTERS,
  type FilterCategory,
  type ProductFilters,
} from "@/lib/filter-products";

interface ProductFiltersContextValue {
  filters: ProductFilters;
  setCategory: (category: FilterCategory) => void;
  setMaxPrice: (maxPrice: number) => void;
  setQuery: (query: string) => void;
  clearFilters: () => void;
}

const ProductFiltersContext = createContext<ProductFiltersContextValue | null>(null);

export function ProductFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const value: ProductFiltersContextValue = {
    filters,
    setCategory: (category) => setFilters((current) => ({ ...current, category })),
    setMaxPrice: (maxPrice) => setFilters((current) => ({ ...current, maxPrice })),
    // Keep the raw input here so matching normalization never moves the caret.
    setQuery: (query) => setFilters((current) => ({ ...current, query })),
    clearFilters: () => setFilters(DEFAULT_FILTERS),
  };

  return (
    <ProductFiltersContext.Provider value={value}>
      {children}
    </ProductFiltersContext.Provider>
  );
}

export function useProductFilters() {
  const context = useContext(ProductFiltersContext);
  if (!context) {
    throw new Error("useProductFilters must be used within ProductFiltersProvider");
  }
  return context;
}
