// MyProductListScreen.tsx
import React, { useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { useRouter, Href } from "expo-router";
import { MasonryFlashList } from "@shopify/flash-list";

import { Screen } from "@/src/components/Screen";
import { Card } from "@/src/components/Card";
import { FilterModal, Filters } from "@/src/components/FilterModal";
import { SearchBar } from "@/src/components/SearchBar";
import { LoadingIndicator } from "@/src/components/LoadingIndicator";
import { ProductHeader } from "@/src/components/ProductHeader";
import { colors, spacing, typography } from "@/src/theme";
import {
  LucideListFilter,
  Package,
  DollarSign,
  User,
  Plus,
} from "lucide-react-native";
import { useHandleProductList } from "@/src/hooks/useHandleProductList";
import { useProducts } from "@/src/hooks/useProducts";
import { useAuth } from "@/src/hooks/useAuth";
import { useProductFiltering } from "@/src/hooks/useProductFiltering";
import { useHandleProfile } from "@/src/hooks/useHandleProfile";
import { formatCurrency } from "@/src/utils/formatter";
import { ProductDTO } from "@/src/dtos/ProductDTO";
import { ConfirmModal } from "@/src/components/global/ConfirmModal";

export default function MyProductListScreen() {
  const { userStats } = useHandleProfile();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  });

  const router = useRouter();
  const { handleAddPress, handleDelete } = useHandleProductList(searchQuery);
  const { products, isLoading } = useProducts();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductDTO | null>();

  // Supposons filteredProducts et handleDelete (réel) déjà dans ton code

  const confirmDelete = (product : ProductDTO) => {
    setItemToDelete(product);
    setModalVisible(true);
  };

  const onDeleteConfirmed = () => {
    if (itemToDelete) {
      // Appelle ta fonction réelle de suppression ici
      handleDelete(itemToDelete);

      // Reset état
      setItemToDelete(null);
      setModalVisible(false);
    }
  };

  const userProducts = products.filter(
    (p) => p.vendeur.toLowerCase() === user?.name.toLowerCase()
  );

  const filteredProducts = useProductFiltering(
    userProducts,
    searchQuery,
    activeFilters
  );

  const handleApplyFilters = (newFilters: Filters) => {
    setActiveFilters(newFilters);
  };

  if (isLoading && products.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <Screen style={{ paddingHorizontal: spacing.sm }}>
      <View style={styles.flashlistContainer}>
        {/* Section Infos & Statistiques */}
        <View style={styles.statsCompactContainer}>
          <View style={styles.statsRow}>
            <View style={styles.compactCard}>
              <Package size={20} color={colors.yellow} />
              <Text style={styles.cardValue}>{userStats.productCount}</Text>
              <Text style={styles.cardLabel}>Produits</Text>
            </View>

            <View style={styles.compactCard}>
              <DollarSign size={20} color={colors.yellow} />
              <Text style={styles.cardValue}>
                {formatCurrency(userStats.totalStockValue)}
              </Text>
              <Text style={styles.cardLabel}>Stock total</Text>
            </View>

            <Pressable
              onPress={() => router.push("/products/add")}
              style={({ pressed }) => [
                styles.compactCard,
                styles.addCard,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Plus color={colors.black} size={24} />
              <Text style={{ ...typography.caption}}>Ajouter</Text>
            </Pressable>
          </View>
        </View>

        {/* Barre de recherche + filtres */}
        <View style={styles.header}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <LucideListFilter color={colors.text} size={24} />
          </Pressable>
        </View>

        {/* Liste des produits */}
        {filteredProducts.length > 0 ? (
          <MasonryFlashList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            estimatedItemSize={225}
            renderItem={({ item }) => (
              <Card
                product={item}
                onPress={() => router.push(`/products/${item.id}` as Href)}
                onEdit={() => router.push(`/products/edit/${item.id}` as Href)}
                onDelete={() => confirmDelete(item)} 
              />
            )}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Aucun produit trouvé.</Text>
          </View>
        )}
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        products={products}
        initialFilters={activeFilters}
      />

      {/* Modal confirmation suppression */}
      <ConfirmModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={onDeleteConfirmed}
        title="Suppression"
        message="Voulez-vous vraiment supprimer ce produit ?"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsCompactContainer: {
  paddingHorizontal: spacing.md,
  marginBottom: spacing.lg,
},

statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.sm,
},

compactCard: {
  flex: 1,
  backgroundColor: colors.blue,
  borderRadius: 12,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.xs,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 80,
  elevation: 3,
  shadowColor: colors.black,
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

cardValue: {
  ...typography.h3,
  color: colors.white,
  marginTop: spacing.xs,
},

cardLabel: {
  ...typography.caption,
  color: colors.white,
  opacity: 0.8,
  marginTop: 2,
},

addCard: {
  backgroundColor: colors.yellow,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.xs,
},

  statsSection: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  statRowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background, // ou colors.surface si défini
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white + "20", // légère transparence
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  statContent: {
    flex: 1,
  },

  statLabel: {
    ...typography.caption,
    color: colors.text,
    opacity: 0.7,
  },

  statValue: {
    ...typography.h2,
    color: colors.text,
    marginTop: 4,
  },

  flashlistContainer: {
    width: "100%",
    flex: 1,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.blue,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    ...typography.h2,
    color: colors.white,
  },

  statCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: "center",
    gap: spacing.xs,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.blue,
    borderRadius: 12,
    borderWidth: 1,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    ...typography.h3,
    color: colors.yellow,
    textAlign: "center",
  },
});
