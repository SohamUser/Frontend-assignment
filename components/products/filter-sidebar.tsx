import {
  MAX_PRICE,
  MIN_PRICE,
  type FilterCategory,
  type ProductFilters,
} from "@/lib/filter-products";
import { formatPrice } from "@/lib/format-price";

const categories = [
  { value: "all", label: "All" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home" },
] as const;

interface FilterSidebarProps {
  filters: ProductFilters;
  onCategoryChange: (category: FilterCategory) => void;
  onMaxPriceChange: (maxPrice: number) => void;
  onClear: () => void;
}

export function FilterSidebar({
  filters,
  onCategoryChange,
  onMaxPriceChange,
  onClear,
}: FilterSidebarProps) {
  return (
    <aside aria-labelledby="filters-heading" className="filter-sidebar grid self-start gap-x-8 rounded-lg bg-navy p-5 text-white sm:grid-cols-2 sm:p-6 lg:block">
      <h2 id="filters-heading" className="text-section-title font-semibold sm:col-span-2">
        Filters
      </h2>
      <fieldset className="mt-5">
        <legend className="mb-2 text-body font-semibold">Category</legend>
        <div className="grid grid-cols-2 sm:grid-cols-1">
          {categories.map(({ value, label }) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
              <input
                type="radio"
                name="category"
                value={value}
                checked={filters.category === value}
                onChange={() => onCategoryChange(value)}
                className="size-4 shrink-0 cursor-pointer accent-accent"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <div className="mt-5">
          <label htmlFor="maximum-price" className="block text-body font-semibold">
            Maximum price
          </label>
          <input
            id="maximum-price"
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={Number.isInteger(filters.maxPrice) ? 1 : "any"}
            value={filters.maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.valueAsNumber)}
            aria-valuetext={`Up to ${formatPrice(filters.maxPrice)}`}
            className="price-slider mt-2 h-8 w-full cursor-pointer"
          />
          <div className="flex justify-between text-caption">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="mt-6 min-h-11 w-full rounded-md border border-white/50 px-3 py-2 text-body font-semibold transition-colors hover:bg-white/10 active:bg-white/20"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}
