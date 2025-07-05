import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { StyledButton } from "./StyledButton";
import { StyledInput } from "./StyledInput";
import {
  X,
  ListFilterIcon,
  RotateCcw,
  Check
} from "lucide-react-native";
import { colors, spacing, typography } from "../theme";
import { ProductDTO } from "../dtos/ProductDTO";

export interface Filters {
  categories: string[];
  vendors: string[];
  price: { min: string; max: string };
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  products: ProductDTO[]; // Pour dériver les catégories et vendeurs
  initialFilters: Filters;
}

const FilterChip: React.FC<{
  label: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ label, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, isSelected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  products,
  initialFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<Filters>(initialFilters);

  // Dériver les listes uniques pour les filtres, mémorisé pour la performance
  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const uniqueVendors = useMemo(
    () => [...new Set(products.map((p) => p.vendeur))],
    [products]
  );

  const handleCategoryToggle = (category: string) => {
    const newCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter((c) => c !== category)
      : [...tempFilters.categories, category];
    setTempFilters({ ...tempFilters, categories: newCategories });
  };

  // Fonction similaire pour handleVendorToggle...

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      categories: [],
      vendors: [],
      price: { min: "", max: "" },
    };
    setTempFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ListFilterIcon size={50} color={colors.yellow} />
              <Text style={styles.title}>Filtres</Text>
            </View>
            <Pressable onPress={onClose}>
              <X size={28} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView>
            <Text style={styles.sectionTitle}>Catégorie</Text>
            <View style={styles.chipContainer}>
              {uniqueCategories.map((cat) => (
                <FilterChip
                  key={cat}
                  label={cat}
                  isSelected={tempFilters.categories.includes(cat)}
                  onPress={() => handleCategoryToggle(cat)}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Prix ($)</Text>
            <View style={styles.priceContainer}>
              <StyledInput
                style={{ fontSize: 12, textAlign: "center" }}
                placeholder="ex : 30"
                keyboardType="numeric"
                label="Min"
                value={tempFilters.price.min}
                onChangeText={(min) =>
                  setTempFilters({
                    ...tempFilters,
                    price: { ...tempFilters.price, min },
                  })
                }
              />
              <StyledInput
                style={{ fontSize: 12, textAlign: "center" }}
                placeholder="ex : 100"
                label="Max"
                keyboardType="numeric"
                value={tempFilters.price.max}
                onChangeText={(max) =>
                  setTempFilters({
                    ...tempFilters,
                    price: { ...tempFilters.price, max },
                  })
                }
              />
            </View>

            {/* Ajouter la section Vendeurs ici, similaire à Catégories */}
          </ScrollView>
          <View style={styles.footer}>
            <StyledButton
              icon={<RotateCcw color={colors.white} size={24} />}
              title="Réinitialiser"
              onPress={handleReset}
              variant="secondary"
            />
            <StyledButton
              icon={<Check color={colors.black} size={24} />}
              title="Appliquer"
              onPress={handleApply}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles pour le modal
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "85%",
    backgroundColor: "#1b263b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  title: { ...typography.h1, color: colors.text },
  sectionTitle: {
    ...typography.h3,
    color: colors.blue,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.black,
    color: colors.black,
  },
  chipSelected: { backgroundColor: colors.yellow },
  chipText: { ...typography.body, color: colors.background },
  chipTextSelected: { color: colors.black, fontFamily: "Lexend-Bold" },
  priceContainer: { flexDirection: "row", gap: spacing.md },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.white,
    paddingTop: spacing.md,
    marginTop: "auto",
  },
});
