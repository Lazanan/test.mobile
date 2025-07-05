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
  const handleDelete = async () => {
    if (product) {
      Alert.alert(
        "Supprimer le produit",
        `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              // On appelle la fonction de suppression du contexte
              await deleteProduct(product.id);

              console.log(`Deleting product ${product.id}`);
              router.back();
            },
          },
        ]
      );
    }
  };

  return { product, setProduct, fetchProduct, handleDelete };
};
