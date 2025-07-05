import React, { useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import { FieldName, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";

import { StyledButton } from "@/src/components/StyledButton";
import { Stepper } from "./subComponents/Stepper";
import { Step1 } from "./subComponents/Step1";
import { Step2 } from "./subComponents/Step2";
import { Step3 } from "./subComponents/Step3";

import { ProductDTO } from "@/src/dtos/ProductDTO";
import { spacing } from "@/src/theme/spacing";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const productSchema = z.object({
  name: z.string().min(3, "Le nom est requis et doit avoir au moins (3 caracteres)"),
  price: z.coerce
    .number({ invalid_type_error: "Prix invalide" })
    .positive("Le prix doit être positif"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock invalide" })
    .int()
    .min(0, "Stock invalide"),
  category: z.string().min(3, "Catégorie requise"),
  vendeur: z.string().min(3, "Vendeur requis"),
  description: z.string(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductDTO;
  onSubmit: (data: ProductFormData, imageUri: string) => Promise<void>;
  isLoading: boolean;
}

const stepsFields: Record<number, FieldName<ProductFormData>[]> = {
  1: ["name", "price", "stock"],
  2: ["category", "vendeur"],
  3: ["description"],
};
const stepNames = ["Infos", "Détails", "Média"];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  isLoading,
}) => {
  const isEditMode = !!product;
  const [imageUri, setImageUri] = useState<string | null>(
    product?.image || null
  );
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditMode
      ? { ...product, description: product.description || "" }
      : {},
    mode: "onChange",
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Accès à la galerie refusé.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (!imageUri) {
      Alert.alert(
        "Image requise",
        "Veuillez sélectionner une image pour le produit."
      );
      return;
    }
    onSubmit(data, imageUri);
  };

  const handleNavigation = async (direction: "next" | "previous") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (direction === "next") {
      const fields = stepsFields[step];
      const isValid = await trigger(fields);
      if (isValid) {
        if (step < totalSteps) {
          setStep(step + 1);
        } else {
          handleSubmit(handleFormSubmit)();
        }
      }
    } else if (direction === "previous" && step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      extraHeight={120}
      enableOnAndroid={true}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Stepper
        currentStep={step}
        totalSteps={totalSteps}
        stepNames={stepNames}
      />

      <View style={styles.card}>
        {step === 1 && <Step1 control={control} errors={errors} />}
        {step === 2 && <Step2 control={control} errors={errors} />}
        {step === 3 && (
          <Step3
            control={control}
            imageUri={imageUri}
            onPickImage={pickImage}
            errors={errors}
          />
        )}
      </View>

      <View style={styles.navigation}>
        {step > 1 && (
          <StyledButton
            title="Précédent"
            onPress={() => handleNavigation("previous")}
            variant="secondary"
            // style={styles.navButton}
          />
        )}
        <StyledButton
          title={
            step < totalSteps
              ? "Suivant"
              : isEditMode
              ? "Enregistrer"
              : "Ajouter"
          }
          onPress={() => handleNavigation("next")}
          loading={isLoading && step === totalSteps}
        //   style={styles.navButton}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: spacing.xl,
  },
  navigation: {
    flexDirection: "row",
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
  },
});
