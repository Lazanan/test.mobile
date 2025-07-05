import { useMemo } from "react";
import { Filters } from "../components/global/FilterModal";
import { ProductDTO } from "../dtos/ProductDTO";

export const useProductFiltering = (
  products: ProductDTO[],
  searchQuery: string,
  activeFilters: Filters
) => {
  return useMemo(() => {
    return products.filter((product) => {
        // conditions du filter
      const searchMatch = searchQuery
        ? (product.name.toLowerCase().includes(searchQuery.toLowerCase())
        || product.category.toLowerCase().includes(searchQuery.toLowerCase())
        || product.price.toString().toLowerCase().includes(searchQuery.toLowerCase())
        || product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        || product.vendeur.toLowerCase().includes(searchQuery.toLowerCase())
        || product.stock.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;

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