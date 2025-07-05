import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Plus, ListMinusIcon } from "lucide-react-native";
import { colors, spacing } from "../theme";

type Props = {
  onAddPress: () => void;
  title?: string;
  description?: string;
};

export const ProductHeader = ({
  onAddPress,
  title = "Listes des Produits",
  description = "Parcourez notre sélection exclusive",
}: Props) => (
  <View style={styles.topHeader}>
    <View style={styles.topHeaderContent}>
      <View>
        <View style={styles.title}>
          <ListMinusIcon size={32} color={colors.blue} />
          <Text style={styles.titleStyle}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{description}</Text>
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
