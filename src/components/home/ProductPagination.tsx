import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { usePagination, DOTS } from "@/src/hooks/usePagination";
import { colors } from "@/src/theme";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export const ProductPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });

  // Si il n'y a qu'une page ou moins, ne rien afficher
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.paginationContainer}>
      {/* Bouton Précédent */}
      <Pressable
        style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
        onPress={onPrevious}
        disabled={currentPage === 1}
      >
        <Text style={styles.pageButtonText}>Prev</Text>
      </Pressable>

      {/* Numéros de page et ellipses */}
      {paginationRange.map((pageNumber, index) => {
        // Si c'est une ellipse, on l'affiche
        if (pageNumber === DOTS) {
          return (
            <Text key={`dots-${index}`} style={styles.ellipsisText}>
              ...
            </Text>
          );
        }

        // Sinon, c'est un numéro de page
        return (
          <Pressable
            key={pageNumber}
            style={[
              styles.pageNumber,
              pageNumber === currentPage && styles.activePage,
            ]}
            onPress={() => setCurrentPage(pageNumber as number)}
          >
            <Text
              style={[
                styles.pageNumberText,
                pageNumber === currentPage && styles.activePageText,
              ]}
            >
              {pageNumber}
            </Text>
          </Pressable>
        );
      })}

      {/* Bouton Suivant */}
      <Pressable
        style={[
          styles.pageButton,
          currentPage === totalPages && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.pageButtonText}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 16, 
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.yellow,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  pageButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 18, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  activePage: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  pageNumberText: {
    color: colors.text,
    fontWeight: "600",
  },
  activePageText: {
    color: colors.white,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: colors.disabled ?? "#555",
    opacity: 0.7,
  },
  ellipsisText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
});