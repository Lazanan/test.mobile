import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyledInput } from "../../global/StyledInput";
import { ProductFormData } from "../ProductForm";
import { colors, spacing, typography } from "../../../theme";

interface Step2Props {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const Step2: React.FC<Step2Props> = ({ control, errors }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Détails commerciaux</Text>

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Category"
            placeholder="Catégorie"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.category?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="vendeur"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Vendeur"
            placeholder="Vendeur"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.vendeur?.message}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
