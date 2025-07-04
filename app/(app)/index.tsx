import React, { useState, useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  RefreshControl,
  Alert,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { useRouter, Href } from "expo-router";
import { Filter, Plus, LucideListCollapse } from "lucide-react-native";
import { colors, spacing, typography } from "../../src/theme";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { MasonryFlashList } from "@shopify/flash-list";
import { useProducts } from "@/src/hooks/useProducts";
import { FilterModal, Filters } from "@/src/components/FilterModal";
import { SearchBar } from "@/src/components/SearchBar";
import { ProductDTO } from "@/src/dtos/ProductDTO";

const PAGE_SIZE = 10;

export default function ProductListScreen() {
  const { products, isLoading, loadProducts, deleteProduct } = useProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    vendors: [],
    price: { min: "", max: "" },
  });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const searchMatch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const categoryMatch =
        activeFilters.categories.length > 0
          ? activeFilters.categories.includes(product.category)
          : true;

      const minPrice = parseFloat(activeFilters.price.min);
      const maxPrice = parseFloat(activeFilters.price.max);
      const priceMatchMin = !isNaN(minPrice)
        ? parseFloat(product.price.toString()) >= minPrice
        : true;
      const priceMatchMax = !isNaN(maxPrice)
        ? parseFloat(product.price.toString()) <= maxPrice
        : true;

      return searchMatch && categoryMatch && priceMatchMin && priceMatchMax;
    });

    return filtered;
  }, [products, searchQuery, activeFilters]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = currentPage * PAGE_SIZE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAddPress = () => router.push("/products/add");

  const handleDelete = (product: ProductDTO) => {
    Alert.alert(
      "Supprimer le produit",
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert("Succès", "Le produit a été supprimé.");
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message || "Impossible de supprimer le produit."
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading && products.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <Screen style={{ paddingHorizontal: spacing.sm }}>
      <View style={styles.flashlistContainer}>
        <View style={styles.topHeader}>
          <View style={styles.topHeaderContent}>
            <View>
              <View style={styles.title}>
                <LucideListCollapse size={32} color={colors.yellow} />
                <Text style={styles.titleStyle}>Listes des Produits</Text>
              </View>
              <Text style={styles.subtitle}>
                Parcourez notre sélection exclusive
              </Text>
            </View>

            <Pressable style={styles.fab} onPress={handleAddPress}>
              <Plus color={colors.yellow} size={36} />
            </Pressable>
          </View>

          <View style={styles.separator} />
        </View>

        <View style={styles.header}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter color={colors.text} size={24} />
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
                  // Passer les fonctions d'action à la carte
                  onEdit={() =>
                    router.push(`/products/edit/${item.id}` as Href)
                  }
                  onDelete={() => handleDelete(item)}
                />
              )}
            />

            {/* PAGINATION BUTTONS */}
            <View style={styles.paginationContainer}>
              <Pressable
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                onPress={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>Prev</Text>
              </Pressable>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <Pressable
                    key={pageNum}
                    style={[
                      styles.pageNumber,
                      pageNum === currentPage && styles.activePage,
                    ]}
                    onPress={() => setCurrentPage(pageNum)}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        pageNum === currentPage && styles.activePageText,
                      ]}
                    >
                      {pageNum}
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                onPress={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Aucun produit ne correspond à votre recherche.
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
  fab: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
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
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 20,
    gap: 8,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.yellow,
  },
  pageButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  pageNumber: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  activePage: {
    backgroundColor: colors.blue,
  },
  activePageText: {
    color: colors.white,
    fontWeight: "bold",
  },
  pageNumberText: {
    color: colors.text,
  },
  disabledButton: {
    backgroundColor: colors.disabled ?? "#ccc",
    opacity: 0.6,
  },
  topHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginHorizontal: "auto",
  },
  topHeaderContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },

  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.yellow,
  },

  subtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
    opacity: 0.8,
  },

  separator: {
    height: 1,
    width: "98%",
    backgroundColor: colors.primary,
    marginVertical: spacing.md,
    borderRadius: 1,
    marginHorizontal: "auto",
  },
});
