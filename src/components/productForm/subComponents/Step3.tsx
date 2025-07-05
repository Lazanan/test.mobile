import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { UploadCloud } from "lucide-react-native";
import { ProductFormData } from "../ProductForm";
import { colors, spacing, typography } from "../../../theme";

interface Step3Props {
  control: Control<ProductFormData>;
  imageUri: string | null;
  onPickImage: () => void;
  errors: FieldErrors<ProductFormData>;
}

export const Step3: React.FC<Step3Props> = ({
  control,
  imageUri,
  onPickImage,
  errors
  
}) => {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Image & Description</Text>

      <Pressable style={styles.imagePicker} onPress={onPickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <UploadCloud size={48} color={colors.white} />
            <Text style={styles.imagePlaceholderText}>Choisir une image</Text>
          </View>
        )}
      </Pressable>

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              placeholder="Description du produit"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              style={[
                styles.description,
                errors.description
                  ? styles.inputError
                  : value?.length > 0
                  ? styles.inputSuccess
                  : null,
              ]}
              placeholderTextColor={"gray"}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            ) : value?.length > 0 ? (
              <Text style={styles.successText}>✓ Champ valide</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputError: {
  borderColor: colors.accent,
  borderWidth: 1,
  borderRadius: 8,
},

inputSuccess: {
  borderColor: "green",
  borderWidth: 1,
  borderRadius: 8,
},

errorText: {
  color: colors.accent,
  marginTop: spacing.xs,
  marginLeft: spacing.xs,
},

successText: {
  color: "green",
  marginTop: spacing.xs,
  marginLeft: spacing.xs,
},

  content: {
    gap: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  imagePicker: {
    height: 200,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderText: {
    ...typography.body,
    color: colors.yellow,
  },
  description: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: colors.white,
    borderRadius: 8,
    ...typography.body,
    padding: spacing.md,
    height: 120,
    textAlignVertical: "top",
  },
});
