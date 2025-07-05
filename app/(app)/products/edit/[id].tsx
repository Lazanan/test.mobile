import React, { useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Screen } from "@/src/components/Screen";
import { ProductForm } from "@/src/components/ProductForm";
import { LoadingIndicator } from "@/src/components/LoadingIndicator";

import { typography, colors, spacing } from "@/src/theme";
import { Edit } from "lucide-react-native";

import { useEditProduct } from "@/src/hooks/useEditProduct";

export default function EditProductScreen() {
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    product,
    isLoadingData,
    isSubmitting,
    fetchProduct,
    handleUpdateProduct,
    fallback
  } = useEditProduct();

  // Récupérer les données du produit à modifier
  useEffect(() => {
    if (id) {
      fetchProduct();
    } else {
      // Si aucun ID n'est fourni
      fallback("Aucun identifiant de produit fourni.")
    }
  }, [id]);

  if (isLoadingData) {
    return <LoadingIndicator />;
  }

  // Sécurité au cas où le produit n'a pas pu être chargé
  if (!product) {
    return (
      <Screen>
        <Text style={{ color: colors.text }}>
          Impossible de charger le produit.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Edit color={colors.blue} />
        <Text style={styles.title}>Modification</Text>
      </View>

      {/* formulaire */}
      <ProductForm
        product={product}
        onSubmit={handleUpdateProduct}
        isLoading={isSubmitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
});
