import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  Image,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { Screen } from "../../../src/components/Screen";
import { StyledButton } from "../../../src/components/StyledButton";
import { StyledInput } from "../../../src/components/StyledInput";
import { typography, colors, spacing } from "../../../src/theme";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { Box, PlusIcon, UploadCloud } from "lucide-react-native";
import { productApi } from "@/src/api/productApi";

const productSchema = z.object({
  name: z.string().min(3, "Le nom est requis"),
  price: z.coerce
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .positive("Le prix doit être positif"),
  stock: z
    .number({ invalid_type_error: "Le stock doit être un nombre" })
    .int()
    .min(0, "Le stock ne peut être négatif"),
  description: z.string(),
  category: z.string().min(3, "La catégorie est requise"),
  vendeur: z.string().min(3, "Le vendeur est requis"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // NOUVELLE LOGIQUE 2: Gestion des permissions avant d'ouvrir la galerie
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la galerie pour sélectionner une image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Ratio carré pour un look plus propre
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const handleAddProduct = async (data: ProductFormData) => {
    if (!imageUri) {
      Alert.alert("Image manquante", "Veuillez sélectionner une image pour le produit.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const productData = { ...data, image: imageUri };
      await productApi.addProduct(productData);

      Alert.alert('Succès', `Le produit "${data.name}" a été ajouté.`);
      router.back();

    } catch (error: any) {
      console.error("Failed to add product:", error);
      Alert.alert('Erreur', error.message || "Une erreur est survenue lors de l'ajout du produit.");
    } finally {
      // Ce bloc s'exécute toujours, garantissant que le chargement s'arrête
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          <Box color={colors.blue} />
          Nouveau Produit
        </Text>

        {/* NOUVELLE LOGIQUE 4: UI améliorée pour le sélecteur d'image */}
        <Pressable style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <UploadCloud size={48} color={colors.white} />
              <Text style={styles.imagePlaceholderText}>Appuyer pour choisir une image</Text>
            </View>
          )}
        </Pressable>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <StyledInput
              placeholder="Nom du produit"
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <StyledInput
              placeholder="Prix (€)"
              onChangeText={(text) => onChange(Number(text))}
              value={String(value || "")}
              keyboardType="numeric"
              error={errors.price?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="stock"
          render={({ field: { onChange, value } }) => (
            <StyledInput
              placeholder="Stock disponible"
              onChangeText={(text) => onChange(Number(text))}
              value={String(value || "")}
              keyboardType="numeric"
              error={errors.stock?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <StyledInput
              placeholder="Catégorie"
              onChangeText={onChange}
              value={value}
              error={errors.category?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="vendeur"
          render={({ field: { onChange, value } }) => (
            <StyledInput
              placeholder="Vendeur"
              onChangeText={onChange}
              value={value}
              error={errors.vendeur?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Description du produit"
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              style={styles.description}
              placeholderTextColor={colors.black + "80"}
            />
          )}
        />

        <StyledButton
          title="Ajouter le produit"
          onPress={handleSubmit(handleAddProduct)}
          loading={isLoading}
          icon={<PlusIcon color={colors.black}/>}

        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md },
  // Nouveaux styles pour le sélecteur d'image
  imagePicker: {
    height: 200,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: colors.border,
    alignSelf: "center",
  },
  imagePlaceholderText: {
    ...typography.body,
    color: colors.yellow,
  },
  description: {
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: 8,
    ...typography.body,
    padding: 8,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
});
