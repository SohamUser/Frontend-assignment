"use client";

import { Search } from "lucide-react";
import { useProductFilters } from "@/context/product-filters-context";

export function ProductSearch() {
  const { filters, setQuery, submitSearch } = useProductFilters();

  return (
    <form
      role="search"
      onSubmit={(event) => { event.preventDefault(); submitSearch(); }}
      className="relative col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
    >
      <label htmlFor="product-search" className="sr-only">
        Search for products
      </label>
      <button type="submit" aria-label="Search products" className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-md text-on-dark-muted hover:text-white">
        <Search size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <input
        id="product-search"
        type="search"
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products..."
        className="h-11 w-full rounded-md border border-white/35 bg-white/5 pr-4 pl-11 text-sm text-white placeholder:text-on-dark-muted"
      />
    </form>
  );
}
