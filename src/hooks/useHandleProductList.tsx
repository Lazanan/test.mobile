import { useState } from "react";
import { useProducts } from "./useProducts";
import { Filters } from "../components/FilterModal";
import { useRouter } from "expo-router";
import { ProductDTO } from "../dtos/ProductDTO";
import { Alert } from "react-native";
import { useProductFiltering } from "./useProductFiltering";

const defaultFilters = {
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  }

const PAGE_SIZE = 10;
export function useHandleProductList(searchQuery : string) {
  // Etats
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Filters>(defaultFilters);

  // hooks customized
  const { products, deleteProduct } = useProducts();
  let filteredProducts = useProductFiltering(
    products,
    searchQuery,
    activeFilters
  );

  const router = useRouter();

  // variables pour la pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  let paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // fonctions handlers
  const handleApplyFilters = (newFilters: Filters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAddPress = () => router.push("/products/add");

  const handleDelete = (product: ProductDTO) => {
    Alert.alert(
      "Supprimer le produit",
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert("Succès", "Le produit a été supprimé.");
              setActiveFilters(defaultFilters);
              paginatedProducts = products;
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message || "Impossible de supprimer le produit."
              );
            }
          },
        },
      ]
    );
  };
  return {
    paginatedProducts,
    totalPages,
    currentPage,
    activeFilters,
    setCurrentPage,
    handleAddPress,
    handleApplyFilters,
    handleDelete,
  };
}
