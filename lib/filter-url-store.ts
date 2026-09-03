import { DEFAULT_FILTERS, type FilterCategory, type ProductFilters } from "./filter-products";
import { homeSearchLocation, locationHref, readFilterParams, writeFilterParams, type FilterLocation } from "./filter-url";

export const SEARCH_DEBOUNCE_MS = 300;

type Schedule = (callback: () => void, delay: number) => () => void;
interface StoreOptions {
  replace: (href: string) => void;
  readLocation?: () => FilterLocation;
  schedule?: Schedule;
}

const scheduleTimeout: Schedule = (callback, delay) => {
  const timer = setTimeout(callback, delay);
  return () => clearTimeout(timer);
};

/**
 * URL acknowledgements must not overwrite a newer local draft. Only one replace
 * is in flight; successive edits coalesce into the latest complete target.
 * This store is framework-independent so races and timers can be tested directly.
 */
export class FilterUrlStore {
  private location: FilterLocation;
  private filters: ProductFilters;
  private committedQuery: string;
  private listeners = new Set<() => void>();
  private inFlight: FilterLocation | null = null;
  private desired: FilterLocation | null = null;
  private cancelSearch: (() => void) | null = null;
  private navigating = false;
  private initialized = false;
  private options: StoreOptions;

  constructor(location: FilterLocation, options: StoreOptions) {
    this.location = location;
    this.options = options;
    this.filters = readFilterParams(new URLSearchParams(location.search));
    this.committedQuery = this.filters.query;
  }

  getSnapshot = () => this.filters;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private publish(filters: ProductFilters) {
    this.filters = filters;
    this.listeners.forEach((listener) => listener());
  }

  private cancelDebounce() {
    this.cancelSearch?.();
    this.cancelSearch = null;
  }

  /** Called before link navigation, not just after its route has committed. */
  beginNavigation = () => {
    this.cancelDebounce();
    this.inFlight = null;
    this.desired = null;
    this.navigating = true;
  };

  /** Popstate can restore even an identical URL before React processes it. */
  restore = (location: FilterLocation) => {
    this.beginNavigation();
    this.navigating = false;
    this.location = location;
    this.committedQuery = readFilterParams(new URLSearchParams(location.search)).query;
    this.publish(readFilterParams(new URLSearchParams(location.search)));
  };

  observe = (location: FilterLocation) => {
    const href = locationHref(location);
    if (this.inFlight && href === locationHref(this.inFlight)) {
      this.location = location;
      this.inFlight = null;
      this.flush();
      return;
    }
    if (!this.initialized || this.navigating || href !== locationHref(this.location)) {
      this.initialized = true;
      this.restore(location);
      if (location.pathname === "/") this.queueHome();
    }
  };

  private synchronizeLocation() {
    const actual = this.options.readLocation?.();
    if (actual && locationHref(actual) !== locationHref(this.location) &&
        (!this.inFlight || locationHref(actual) !== locationHref(this.inFlight))) {
      this.restore(actual);
      return false;
    }
    return !this.navigating;
  }

  private queueHome() {
    this.desired = {
      pathname: "/",
      search: writeFilterParams(this.location.search, { ...this.filters, query: this.committedQuery }),
    };
    this.flush();
  }

  private flush() {
    if (this.inFlight || !this.desired || this.navigating) return;
    const target = this.desired;
    this.desired = null;
    if (locationHref(target) === locationHref(this.location)) return;
    this.inFlight = target;
    this.options.replace(locationHref(target));
  }

  setCategory = (category: FilterCategory) => {
    this.synchronizeLocation();
    this.publish({ ...this.filters, category });
    if (this.location.pathname === "/" && !this.navigating) this.queueHome();
  };

  setMaxPrice = (maxPrice: number) => {
    this.synchronizeLocation();
    this.publish({ ...this.filters, maxPrice });
    if (this.location.pathname === "/" && !this.navigating) this.queueHome();
  };

  setQuery = (query: string) => {
    this.synchronizeLocation();
    this.cancelDebounce();
    this.publish({ ...this.filters, query });
    // On detail/cart pages only explicit form submission leaves the page.
    if (this.location.pathname !== "/" || this.navigating) return;
    this.cancelSearch = (this.options.schedule ?? scheduleTimeout)(() => {
      this.cancelSearch = null;
      if (!this.synchronizeLocation()) return;
      this.committedQuery = this.filters.query;
      this.queueHome();
    }, SEARCH_DEBOUNCE_MS);
  };

  clearFilters = () => {
    this.synchronizeLocation();
    this.cancelDebounce();
    this.committedQuery = "";
    this.publish(DEFAULT_FILTERS);
    if (this.location.pathname === "/" && !this.navigating) this.queueHome();
  };

  submitSearch = () => {
    this.synchronizeLocation();
    this.cancelDebounce();
    this.committedQuery = this.filters.query;
    if (this.location.pathname === "/") {
      this.queueHome();
    } else {
      this.publish({ ...DEFAULT_FILTERS, query: this.filters.query });
      this.desired = homeSearchLocation(this.location.search, this.filters.query);
      this.flush();
    }
  };

  dispose = () => {
    this.beginNavigation();
    this.initialized = false;
  };
}
