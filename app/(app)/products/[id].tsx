import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Href, useFocusEffect } from "expo-router";
import { Screen } from "../../../src/components/Screen";
import { productApi } from "../../../src/api/productApi";
import { ProductDTO } from "../../../src/dtos/ProductDTO";
import { LoadingIndicator } from "../../../src/components/LoadingIndicator";
import { typography, colors, spacing } from "../../../src/theme";
import { Tag, Package, User, DollarSign } from "lucide-react-native";
import { StyledButton } from "../../../src/components/StyledButton";

import { useProducts } from '@/src/hooks/useProducts';


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDTO | null>(null);

  // 1. Récupérer la liste globale et la fonction de suppression depuis le contexte
  const { products, deleteProduct, isLoading } = useProducts();

  
   // 3. Utiliser useFocusEffect pour mettre à jour les données chaque fois que l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      if (id && products.length > 0) {
        // On cherche le produit avec les données les plus à jour depuis le contexte
        const currentProduct = products.find(p => p.id === id);
        if (currentProduct) {
          setProduct(currentProduct);
        } else {
          // Si le produit n'est plus dans la liste (ex: supprimé sur un autre appareil)
          // On redirige l'utilisateur
          Alert.alert("Produit introuvable", "Ce produit n'existe plus.", [
            { text: "OK", onPress: () => router.back() }
          ]);
        }
      }
    }, [id, products]) // Ce hook se redéclenchera si l'ID ou la liste de produits change
  );
  
  if (isLoading || !product) {
    return <LoadingIndicator />;
  }
  
  const EditScreenPath = `products/edit/${id}`;


  const handleDelete = async() => {
    Alert.alert(
      "Supprimer le produit",
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async() => {
            // On appelle la fonction de suppression du contexte
              await deleteProduct(product.id);
            
            console.log(`Deleting product ${product.id}`);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoGrid}>
            <InfoChip
              icon={<DollarSign size={18} color={colors.secondary} />}
              label="Prix"
              value={`${product.price.toFixed(2)} €`}
            />
            <InfoChip
              icon={<Package size={18} color={colors.secondary} />}
              label="Stock"
              value={String(product.stock)}
            />
            <InfoChip
              icon={<Tag size={18} color={colors.secondary} />}
              label="Catégorie"
              value={product.category}
            />
            <InfoChip
              icon={<User size={18} color={colors.secondary} />}
              label="Vendeur"
              value={product.vendeur}
            />
          </View>
        </View>
        <View style={styles.actions}>
          <StyledButton
            title="Modifier"
            onPress={() => {
              /* Navigation vers l'écran de modification */
              router.push(EditScreenPath as Href);
            }}
            variant="secondary"
          />
          <StyledButton
            title="Supprimer"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const InfoChip = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={styles.chip}>
    <View style={styles.chipHeader}>
      {icon}
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
    <Text style={styles.chipValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  image: { width: "100%", height: 300, backgroundColor: colors.white },
  content: { padding: spacing.md },
  name: { ...typography.h1, marginBottom: spacing.sm, color: colors.white },
  description: {
    ...typography.body,
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: spacing.lg,
    color: colors.white,
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  chip: {
    flexBasis: "47%",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  chipHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  chipLabel: { ...typography.caption, textTransform: "uppercase" },
  chipValue: { ...typography.body },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
});
