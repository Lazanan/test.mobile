import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useProducts } from "./useProducts";
import { ProductDTO } from "../dtos/ProductDTO";
import { Alert } from "react-native";

export const useHandleProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDTO | null>(null);

  //Récupérer la liste globale et la fonction de suppression depuis le contexte
  const { products, deleteProduct } = useProducts();

  const fetchProduct = useCallback(() => {
    if (id && products.length > 0) {
      // Chercher le produit
      const currentProduct = products.find((p) => p.id === id);
      if (currentProduct) {
        setProduct(currentProduct);
      } else {
        // Si le produit n'est pas dans la liste
        Alert.alert("Produit introuvable", "Ce produit n'existe plus.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    }
  }, [id, products]); //se redéclenchera si l'ID ou la liste de produits change

  // fonction pour supprimer un produit
  const handleDelete = async (product: ProductDTO) => {
      try {
        await deleteProduct(product.id);
        Alert.alert("Succès", "Le produit a été supprimé.");
      } catch (error: any) {
        Alert.alert(
          "Erreur",
          error.message || "Impossible de supprimer le produit."
        );
      }
    };

  return { product, setProduct, fetchProduct, handleDelete };
};
