import { DEFAULT_FILTERS, MAX_PRICE, MIN_PRICE, type ProductFilters } from "./filter-products";

export interface FilterLocation {
  pathname: string;
  search: string;
}

export function readFilterParams(params: Pick<URLSearchParams, "get">): ProductFilters {
  const category = params.get("category");
  // Fixed zero lower bound; finite decimal/exponent syntax, not Infinity or hex.
  const price = /^0-([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)$/i.exec(params.get("price") ?? "");
  const maximum = price ? Number(price[1]) : NaN;

  return {
    category: category === "electronics" || category === "clothing" || category === "home"
      ? category : "all",
    maxPrice: price && !Number.isNaN(maximum)
      ? Math.min(MAX_PRICE, Math.max(MIN_PRICE, maximum)) : MAX_PRICE,
    query: params.get("q") ?? "",
  };
}

/** Replace only owned keys; unrelated parameters (including duplicates) survive. */
export function writeFilterParams(search: string, filters: ProductFilters): string {
  const params = new URLSearchParams(search);
  params.delete("category");
  params.delete("price");
  params.delete("q");
  if (filters.category !== DEFAULT_FILTERS.category) params.set("category", filters.category);
  if (filters.maxPrice !== MAX_PRICE) params.set("price", `0-${filters.maxPrice}`);
  const query = filters.query.trim();
  if (query) params.set("q", query);
  return params.toString();
}

export function locationHref({ pathname, search }: FilterLocation): string {
  return search ? `${pathname}?${search}` : pathname;
}

export function homeSearchLocation(search: string, query: string): FilterLocation {
  return { pathname: "/", search: writeFilterParams(search, { ...DEFAULT_FILTERS, query }) };
}
