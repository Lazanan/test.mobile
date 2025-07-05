import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyledInput } from "../../global/StyledInput";
import { ProductFormData } from "../ProductForm";
import { colors, spacing, typography } from "../../../theme";

interface Step1Props {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const Step1: React.FC<Step1Props> = ({ control, errors }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Informations générales</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            placeholder="nom du produit"
            label="Nom du produit"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Prix"
            placeholder="Prix (€)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={String(value || "")}
            keyboardType="numeric"
            error={errors.price?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput
            label="Stock"
            placeholder="Stock disponible"
            onBlur={onBlur}
            onChangeText={onChange}
            value={String(value || "")}
            keyboardType="numeric"
            error={errors.stock?.message}
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
