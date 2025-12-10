import { useState, useMemo } from "react";
import { Filters } from "../components/FilterPanel";
import { Product } from "../components/ProductCard";

export function useFilters(products: Product[]) {
  const [filters, setFilters] = useState<Filters>({
    productType: [],
    brand: [],
    consoleLine: [],
    condition: [],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    searchQuery: ""
  });

  const updateSearchQuery = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === "all") {
      setFilters({
        productType: [],
        brand: [],
        consoleLine: [],
        condition: [],
        priceRange: { min: 0, max: 1000 },
        rating: 0,
        searchQuery: filters.searchQuery
      });
      return;
    }

    if (filterType === "priceRange") {
      setFilters({ ...filters, priceRange: { min: 0, max: 1000 } });
    } else if (filterType === "rating") {
      setFilters({ ...filters, rating: 0 });
    } else if (value) {
      const key = filterType as keyof Pick<
        Filters,
        "productType" | "brand" | "consoleLine" | "condition"
      >;
      setFilters({
        ...filters,
        [key]: filters[key].filter((v) => v !== value)
      });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.type.toLowerCase().includes(query) ||
          product.consoleLine.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Product type
      if (filters.productType.length > 0 && !filters.productType.includes(product.type)) {
        return false;
      }

      // Brand
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Console line
      if (filters.consoleLine.length > 0 && !filters.consoleLine.includes(product.consoleLine)) {
        return false;
      }

      // Condition
      if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
        return false;
      }

      // Price range
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }

      // Rating
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  return {
    filters,
    setFilters,
    updateSearchQuery,
    removeFilter,
    filteredProducts
  };
}
