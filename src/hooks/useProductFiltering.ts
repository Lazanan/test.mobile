import { useMemo } from "react";
import { Filters } from "../components/FilterModal";
import { ProductDTO } from "../dtos/ProductDTO";

export const useProductFiltering = (
  products: ProductDTO[],
  searchQuery: string,
  activeFilters: Filters
) => {
  return useMemo(() => {
    return products.filter((product) => {
        // condiitions du filter
      const searchMatch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const categoryMatch =
        activeFilters.categories.length > 0
          ? activeFilters.categories.includes(product.category)
          : true;

      const minPrice = parseFloat(activeFilters.price.min);
      const maxPrice = parseFloat(activeFilters.price.max);

      const priceMatchMin = !isNaN(minPrice)
        ? parseFloat(product.price.toString()) >= minPrice
        : true;

      const priceMatchMax = !isNaN(maxPrice)
        ? parseFloat(product.price.toString()) <= maxPrice
        : true;

      return searchMatch && categoryMatch && priceMatchMin && priceMatchMax;
    });
  }, [products, searchQuery, activeFilters]);
};