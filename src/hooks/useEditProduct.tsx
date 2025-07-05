import { useState } from "react";
import { ProductDTO } from "../dtos/ProductDTO";
import { useProducts } from "./useProducts";
import { productApi } from "../api/productApi";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductFormData } from "@/src/components/ProductForm";

export const useEditProduct = () => {
  // etats
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Pour le chargement initial
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour la soumission

  // parametre url [id] du produit a editer
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { updateProduct } = useProducts();

  const fetchProduct = async () => {
    const data = await productApi.getById(id);
    try {
      if (data) setProduct(data);
    } catch (error: any) {
      fallback("Produit non trouvé.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdateProduct = async (
    data: ProductFormData,
    imageUri: string
  ) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const updateData = { ...data, image: imageUri };
      // On appelle la fonction du contexte, qui gère l'API ET la mise à jour de l'état
      await updateProduct(id, updateData);

      Alert.alert("Succès", "Les modifications ont été enregistrées.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de sauvegarder les modifications."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function fallback(message: string) {
    Alert.alert("Erreur", message, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return {
    product,
    isLoadingData,
    isSubmitting,
    fetchProduct,
    handleUpdateProduct,
    fallback,
  };
};
