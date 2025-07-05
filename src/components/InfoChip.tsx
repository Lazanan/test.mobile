import { View, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type InfoChiProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export const InfoChip = ({ icon, label, value }: InfoChiProps) => (
  <View style={styles.chip}>
    <View style={styles.chipHeader}>
      {icon}
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
    <Text style={styles.chipValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flexBasis: "47%",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  chipHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  chipLabel: { ...typography.caption, textTransform: "uppercase" },
  chipValue: { ...typography.body },
});
