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
// Les imports relatifs sont ajustés car ce fichier est dans `src/components/`
import { StyledButton } from "./StyledButton";
import { StyledInput } from "./StyledInput";
import { typography, colors, spacing } from "../theme"; // Utilise votre nouveau colors.ts
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { PlusIcon, UploadCloud } from "lucide-react-native"; // Icônes utilisées dans le JSX
import { ProductDTO } from "../dtos/ProductDTO";

// Le schéma Zod est exactement celui que vous avez défini.
const productSchema = z.object({
  name: z.string().min(3, "Le nom est requis"),
  price: z.coerce
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .positive("Le prix doit être positif"),
  stock: z.coerce
    .number({ invalid_type_error: "Le stock doit être un nombre" })
    .int()
    .min(0, "Le stock ne peut être négatif"),
  description: z.string(),
  category: z.string().min(3, "La catégorie est requise"),
  vendeur: z.string().min(3, "Le vendeur est requis"),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Props que le formulaire réutilisable attend.
interface ProductFormProps {
  product?: ProductDTO; // Le produit à modifier (optionnel).
  onSubmit: (data: ProductFormData, imageUri: string) => Promise<void>;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, isLoading }) => {
  const isEditMode = !!product;
  const [imageUri, setImageUri] = useState<string | null>(product?.image || null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    // Pré-remplissage des champs si on est en mode édition.
    defaultValues: isEditMode ? { ...product, description: product.description || '' } : {},
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la galerie pour sélectionner une image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
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
      Alert.alert("Image manquante", "Veuillez sélectionner une image pour le produit.");
      return;
    }
    // On appelle la fonction onSubmit fournie par le composant parent.
    onSubmit(data, imageUri);
  };

  return (
    // Le JSX est une copie exacte de votre ScrollView.
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput placeholder="Nom du produit" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.name?.message}/>
        )}
      />
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput placeholder="Prix (€)" onBlur={onBlur} onChangeText={onChange} value={String(value || "")} keyboardType="numeric" error={errors.price?.message}/>
        )}
      />
      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput placeholder="Stock disponible" onBlur={onBlur} onChangeText={onChange} value={String(value || "")} keyboardType="numeric" error={errors.stock?.message}/>
        )}
      />
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput placeholder="Catégorie" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.category?.message}/>
        )}
      />
      <Controller
        control={control}
        name="vendeur"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledInput placeholder="Vendeur" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.vendeur?.message}/>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Description du produit"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={4}
            style={styles.description}
            placeholderTextColor={colors.text + "80"} // Utilisation de la couleur de texte principale avec opacité
          />
        )}
      />

      <StyledButton
        // Le titre du bouton s'adapte automatiquement au mode.
        title={isEditMode ? "Sauvegarder les modifications" : "Ajouter le produit"}
        onPress={handleSubmit(handleFormSubmit)}
        loading={isLoading}
        // La prop `icon` n'est pas gérée par StyledButton, donc je la retire.
        // Si vous voulez une icône, il faudra modifier le composant StyledButton pour l'accepter.
      />
    </ScrollView>
  );
}

// Les styles sont une copie exacte de vos styles.
const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md },
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
    // Les styles de l'image preview de votre add.tsx original étaient un peu différents.
    // J'ai fusionné les deux pour un meilleur rendu.
  },
  imagePlaceholderText: {
    ...typography.body,
    color: colors.yellow,
  },
  description: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fond semi-transparent pour le thème sombre
    color: colors.text, // Couleur du texte principal
    borderRadius: 8,
    ...typography.body,
    padding: spacing.md,
    height: 120,
    textAlignVertical: 'top',
  },
  // Le style du titre a été retiré car le titre est maintenant géré par l'écran parent.
});