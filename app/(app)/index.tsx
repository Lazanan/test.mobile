import React, { useState, useCallback, useMemo } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { productApi } from "../../src/api/productApi";
import { ProductDTO } from "../../src/dtos/ProductDTO";
import { useRouter, useFocusEffect, Href } from "expo-router";
import { Filter, Plus } from "lucide-react-native";
import { colors, spacing, typography } from "../../src/theme";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { MasonryFlashList } from "@shopify/flash-list";
import { useProducts } from "@/src/hooks/useProducts";
import { RefreshControl } from "react-native";
import { FilterModal, Filters } from "@/src/components/FilterModal";
import { SearchBar } from "@/src/components/SearchBar";

export default function ProductListScreen() {
  // On récupère l'état directement depuis le contexte !
  const { products, isLoading, loadProducts } = useProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // États pour les contrôles de filtrage
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtre par recherche
      const searchMatch =
        searchQuery.length > 0
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;

      // Filtre par catégorie
      const categoryMatch =
        activeFilters.categories.length > 0
          ? activeFilters.categories.includes(product.category)
          : true;

      // Filtre par vendeur (à ajouter si vous implémentez la section)

      // Filtre par prix
      const minPrice = parseFloat(activeFilters.price.min);
      const maxPrice = parseFloat(activeFilters.price.max);
      const priceMatchMin = !isNaN(minPrice) ? product.price >= minPrice : true;
      const priceMatchMax = !isNaN(maxPrice) ? product.price <= maxPrice : true;

      return searchMatch && categoryMatch && priceMatchMin && priceMatchMax;
    });
  }, [products, searchQuery, activeFilters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  if (isLoading && products.length === 0) {
    return <LoadingIndicator />;
  }

  // Fonctions pour gérer les actions
  const handleProductPress = (id: string) =>
    router.push(`/products/${id}` as Href);
  const handleAddPress = () => router.push("/products/add");
  const handleApplyFilters = (newFilters: Filters) =>
    setActiveFilters(newFilters);

  return (
    <Screen style={{ paddingHorizontal: spacing.sm }}>
      <View style={styles.flashlistContainer}>
        {/* Barre de recherche et bouton de filtre */}
        <View style={styles.header}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter color={colors.text} size={24} />
          </Pressable>
        </View>

        {/* Liste des produits filtrés */}
        {filteredProducts.length > 0 ? (
          <MasonryFlashList
            data={filteredProducts}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <Card
                product={item}
                onPress={() => handleProductPress(item.id)}
              />
            )}
            estimatedItemSize={225}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Aucun produit ne correspond à votre recherche.
            </Text>
          </View>
        )}
      </View>

      {/* Modale de filtres */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        products={products}
        initialFilters={activeFilters}
      />

      <Pressable style={styles.fab} onPress={handleAddPress}>
        <View style={styles.fabShadow} />
        <Plus color={colors.white} size={32} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  fabShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
    top: 3,
    left: 3,
    borderRadius: 30,
    zIndex: -1,
  },
  flashlistContainer: {
    width: "100%",
    flex: 1,
  },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: { ...typography.h3, color: colors.yellow },
});
