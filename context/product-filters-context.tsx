"use client";

import {
  createContext, useContext, useEffect, useLayoutEffect, useState,
  useSyncExternalStore, type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FilterCategory, type ProductFilters } from "@/lib/filter-products";
import { FilterUrlStore } from "@/lib/filter-url-store";

interface ProductFiltersContextValue {
  filters: ProductFilters;
  setCategory: (category: FilterCategory) => void;
  setMaxPrice: (maxPrice: number) => void;
  setQuery: (query: string) => void;
  clearFilters: () => void;
  submitSearch: () => void;
}

const ProductFiltersContext = createContext<ProductFiltersContextValue | null>(null);

export function ProductFiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [store] = useState(() => new FilterUrlStore({ pathname, search }, {
    replace: (href) => router.replace(`${href}${window.location.hash}`, { scroll: false }),
    readLocation: () => ({ pathname: window.location.pathname, search: window.location.search.slice(1) }),
  }));
  const filters = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  useLayoutEffect(() => {
    store.observe({ pathname, search });
  }, [pathname, search, store]);

  useEffect(() => {
    const onPopState = () => store.restore({
      pathname: window.location.pathname,
      search: window.location.search.slice(1),
    });
    const onLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download") ||
          (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href);
      if (destination.origin === window.location.origin &&
          (destination.pathname !== window.location.pathname || destination.search !== window.location.search)) {
        store.beginNavigation();
      } else if (destination.origin === window.location.origin && !link.getAttribute("href")?.startsWith("#")) {
        // A home link may target the current URL while a search is still pending.
        onPopState();
      }
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onLinkClick, true);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onLinkClick, true);
      store.dispose();
    };
  }, [store]);

  const value: ProductFiltersContextValue = {
    filters,
    setCategory: store.setCategory,
    setMaxPrice: store.setMaxPrice,
    setQuery: store.setQuery,
    clearFilters: store.clearFilters,
    submitSearch: store.submitSearch,
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
