"use client";

import { Search } from "lucide-react";
import { useProductFilters } from "@/context/product-filters-context";

export function ProductSearch() {
  const { filters, setQuery } = useProductFilters();

  return (
    <div className="relative col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
      <label htmlFor="product-search" className="sr-only">
        Search for products
      </label>
      <Search
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-on-dark-muted"
      />
      <input
        id="product-search"
        type="search"
        value={filters.query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products..."
        className="h-11 w-full rounded-md border border-white/35 bg-white/5 pr-4 pl-11 text-sm text-white placeholder:text-on-dark-muted"
      />
    </div>
  );
}
