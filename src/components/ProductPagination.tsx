import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export const ProductPagination = ({ currentPage, totalPages, setCurrentPage }: Props) => (
  <View style={styles.paginationContainer}>
    <Pressable
      style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
      onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <Text style={styles.pageButtonText}>Prev</Text>
    </Pressable>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
      <Pressable
        key={num}
        style={[styles.pageNumber, num === currentPage && styles.activePage]}
        onPress={() => setCurrentPage(num)}
      >
        <Text style={[styles.pageNumberText, num === currentPage && styles.activePageText]}>
          {num}
        </Text>
      </Pressable>
    ))}

    <Pressable
      style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
      onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <Text style={styles.pageButtonText}>Next</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
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
});