import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { MasonryFlashList } from "@shopify/flash-list";

import { Screen } from "@/src/components/global/Screen";
import { Card } from "@/src/components/global/Card";
import { FilterModal } from "@/src/components/global/FilterModal";
import { SearchBar } from "@/src/components/global/SearchBar";
import { LoadingIndicator } from "@/src/components/global/LoadingIndicator";
import { ProductHeader } from "@/src/components/home/ProductHeader";
import { ProductPagination } from "@/src/components/home/ProductPagination";

import { colors, spacing, typography } from "@/src/theme";
import { LucideListFilter } from "lucide-react-native";
import { useHandleProductList } from "@/src/hooks/useHandleProductList";
import { useProducts } from "@/src/hooks/useProducts";
import { ProductDTO } from "@/src/dtos/ProductDTO";
import { ConfirmModal } from "@/src/components/global/ConfirmModal";

export default function ProductListScreen() {
  // Etats
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductDTO | null>();

  const confirmDelete = (product: ProductDTO) => {
    setItemToDelete(product);
    setModalVisible(true);
  };

  const onDeleteConfirmed = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete);

      // Reset état
      setItemToDelete(null);
      setModalVisible(false);
    }
  };

  const router = useRouter();

  // customed hooks
  const { products, isLoading, loadProducts } = useProducts();

  const {
    paginatedProducts,
    totalPages,
    currentPage,
    activeFilters,
    setCurrentPage,
    handleAddPress,
    handleApplyFilters,
    handleDelete,
  } = useHandleProductList(searchQuery);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  if (isLoading && products.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <Screen style={{ paddingHorizontal: spacing.sm }}>
      <View style={styles.flashlistContainer}>
        <ProductHeader onAddPress={handleAddPress} />

        <View style={styles.header}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <LucideListFilter color={colors.text} size={24} />
          </Pressable>
        </View>

        {paginatedProducts.length > 0 ? (
          <>
            <MasonryFlashList
              data={paginatedProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              estimatedItemSize={225}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              }
              renderItem={({ item }) => (
                <Card
                  product={item}
                  onPress={() => router.push(`/products/${item.id}` as Href)}
                  onEdit={() =>
                    router.push(`/products/edit/${item.id}` as Href)
                  }
                  onDelete={() => confirmDelete(item)}
                />
              )}
            />

            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
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
