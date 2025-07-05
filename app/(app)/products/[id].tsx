import React, { useCallback } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import {
  useLocalSearchParams,
  useRouter,
  Href,
  useFocusEffect,
} from "expo-router";
import {
  Tag,
  Package,
  User,
  DollarSign,
  Edit3Icon,
  Trash,
} from "lucide-react-native";

import { typography, colors, spacing } from "@/src/theme";

import { Screen } from "@/src/components/Screen";
import { StyledButton } from "@/src/components/StyledButton";
import { LoadingIndicator } from "@/src/components/LoadingIndicator";
import { InfoChip } from "@/src/components/InfoChip";

import { useProducts } from "@/src/hooks/useProducts";
import { useHandleProductDetail } from "@/src/hooks/useHandleProductDetail";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { product, setProduct, handleDelete } = useHandleProductDetail();
  const { products, isLoading } = useProducts();

  useFocusEffect(
    useCallback(() => {
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
    }, [id, products])
  ); //se redéclenchera si l'ID ou la liste de produits change

  if (isLoading || !product) {
    return <LoadingIndicator />;
  }

  const Infos = [
    {
      icon: <DollarSign size={18} color={colors.secondary} />,
      label: "Prix",
      value: `${product.price.toFixed(2)} €`,
    },
    {
      icon: <Package size={18} color={colors.secondary} />,
      label: "Stock",
      value: String(product.stock),
    },
    {
      icon: <Tag size={18} color={colors.secondary} />,
      label: "Catégorie",
      value: product.category,
    },
    {
      icon: <User size={18} color={colors.secondary} />,
      label: "Vendeur",
      value: product.vendeur,
    },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.infoGrid}>
            {Infos.map((info, index) => (
              <InfoChip
                key={index}
                icon={info.icon}
                label={info.label}
                value={info.value}
              />
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <StyledButton
            icon={<Edit3Icon size={24} color={colors.white} />}
            title="Modifier"
            onPress={() => {
              router.push(`products/edit/${id}` as Href);
            }}
            variant="secondary"
          />
          <StyledButton
            icon={<Trash size={24} />}
            title="Supprimer"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 300, backgroundColor: colors.white },
  content: { padding: spacing.md },
  name: { ...typography.h2, marginBottom: spacing.sm, color: colors.white },
  description: {
    ...typography.caption,
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: spacing.lg,
    color: colors.white,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
