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
import { LucideListFilter } from "lucide-react-native";
import { useHandleProductList } from "@/src/hooks/useHandleProductList";
import { useProducts } from "@/src/hooks/useProducts";
import { useAuth } from "@/src/hooks/useAuth";
import { useProductFiltering } from "@/src/hooks/useProductFiltering";
import { useHandleProfile } from "@/src/hooks/useHandleProfile";

export default function MyProductListScreen() {
  // Etats
  const { userStats } = useHandleProfile();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  });

  const router = useRouter();

  // customed hooks
  const { handleAddPress, handleDelete } = useHandleProductList(searchQuery);
  const { products, isLoading } = useProducts();
  const { user } = useAuth();
  const userProducts = products.filter((p) => p.vendeur.toLowerCase() === user?.name.toLowerCase());
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
        <ProductHeader
          onAddPress={handleAddPress}
          title="Mes produits"
          description="Parcourir les produits actuels"
        />

        <View style={styles.header}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <LucideListFilter color={colors.text} size={24} />
          </Pressable>
        </View>

        {filteredProducts.length > 0 ? (
          <>
            <MasonryFlashList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              estimatedItemSize={225}
              renderItem={({ item }) => (
                <Card
                  product={item}
                  onPress={() => router.push(`/products/${item.id}` as Href)}
                  onEdit={() =>
                    router.push(`/products/edit/${item.id}` as Href)
                  }
                  onDelete={() => handleDelete(item)}
                />
              )}
            />
          </>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Aucun produit trouvé.
            </Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  flashlistContainer: {
    width: "100%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
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
