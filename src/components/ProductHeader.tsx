import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LucideListCollapse, Plus } from "lucide-react-native";
import { colors, spacing } from "../theme";

type Props = {
  onAddPress: () => void;
};

export const ProductHeader = ({ onAddPress }: Props) => (
  <View style={styles.topHeader}>
    <View style={styles.topHeaderContent}>
      <View>
        <View style={styles.title}>
          <LucideListCollapse size={32} color={colors.yellow} />
          <Text style={styles.titleStyle}>Listes des Produits</Text>
        </View>
        <Text style={styles.subtitle}>Parcourez notre sélection exclusive</Text>
      </View>
      <Pressable style={styles.fab} onPress={onAddPress}>
        <Plus color={colors.yellow} size={36} />
      </Pressable>
    </View>
    <View style={styles.separator} />
  </View>
);

const styles = StyleSheet.create({
  topHeader: {
    alignItems: "center",
    width: "100%",
  },
  topHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  title: {
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
  },
  fab: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});