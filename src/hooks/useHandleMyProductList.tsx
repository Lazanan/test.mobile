import { useState } from "react";
import { Filters } from "@/src/components/global/FilterModal";
import { useHandleProductList } from "./useHandleProductList";
import { useProducts } from "./useProducts";
import { useAuth } from "./useAuth";
import { useProductFiltering } from "./useProductFiltering";
import { ProductDTO } from "@/src/dtos/ProductDTO";

export function useHandleMyProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductDTO | null>(null);

  const { handleDelete } = useHandleProductList(searchQuery);
  const { products, isLoading } = useProducts();
  const { user } = useAuth();

  // Produits de l'utilisateur
  const userProducts = products.filter(
    (p) => p.vendeur.toLowerCase() === user?.name.toLowerCase()
  );

  // Produits après filtres et recherche
  const filteredProducts = useProductFiltering(
    userProducts,
    searchQuery,
    activeFilters
  );

  const confirmDelete = (product: ProductDTO) => {
    setItemToDelete(product);
    setModalVisible(true);
  };

  const onDeleteConfirmed = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    filteredProducts,
    isLoading,
    modalVisible,
    setModalVisible,
    confirmDelete,
    onDeleteConfirmed,
    products,
  };
}
