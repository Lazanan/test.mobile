import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { useProducts } from "./useProducts";
import { Alert } from "react-native";

export function useHandleProfile() {
  const { user, updateUser, logout } = useAuth();
  const { products } = useProducts();
  
  const userStats = useMemo(() => {
    if (!user?.name) return { productCount: 0, totalStockValue: 0 };

    const userProducts = products.filter((p) => p.vendeur === user.name);

    const productCount = userProducts.length;

    const totalStockValue = userProducts.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);

    return {
      productCount,
      totalStockValue,
    };
  }, [products, user?.name]);

  const handleUpdate = async (field: "name" | "email", value: string) => {
    try {
      if (value.trim() === "") {
        Alert.alert("Erreur", "Le champ ne peut pas être vide.");
        return;
      }
      await updateUser({ [field]: value });
      Alert.alert("Succès", "Votre profil a été mis à jour.");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return { user, userStats, logout, handleUpdate};
}
