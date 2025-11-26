import { X } from "lucide-react-native";
import { Filters } from "./FilterPanel";

interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (filterType: string, value?: string) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const activeFilters: { type: string; label: string; value?: string }[] = [];

  filters.productType.forEach((type) => {
    activeFilters.push({ type: "productType", label: type, value: type });
  });

  filters.brand.forEach((brand) => {
    activeFilters.push({ type: "brand", label: brand, value: brand });
  });

  filters.consoleLine.forEach((line) => {
    activeFilters.push({ type: "consoleLine", label: line, value: line });
  });

  filters.condition.forEach((condition) => {
    activeFilters.push({ type: "condition", label: condition, value: condition });
  });

  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    activeFilters.push({
      type: "priceRange",
      label: `$${filters.priceRange.min} - $${filters.priceRange.max}`
    });
  }

  if (filters.rating > 0) {
    activeFilters.push({
      type: "rating",
      label: `${filters.rating}+ Stars`
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-gray-600 text-sm">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <button
            key={`${filter.type}-${filter.value || filter.label}-${index}`}
            onClick={() => onRemoveFilter(filter.type, filter.value)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            <span>{filter.label}</span>
            <X className="w-3 h-3" />
          </button>
        ))}
        <button
          onClick={() => onRemoveFilter("all")}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
