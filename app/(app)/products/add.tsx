import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, Text, View, Image } from 'react-native';
import { Screen } from '../../../src/components/Screen';
import { StyledButton } from '../../../src/components/StyledButton';
import { StyledInput } from '../../../src/components/StyledInput';
import { typography, colors, spacing } from '../../../src/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const productSchema = z.object({
  name: z.string().min(3, 'Le nom est requis'),
  price: z.number({ invalid_type_error: "Le prix doit être un nombre" }).positive('Le prix doit être positif'),
  stock: z.number({ invalid_type_error: "Le stock doit être un nombre" }).int().min(0, 'Le stock ne peut être négatif'),
  description: z.string().optional(),
  category: z.string().min(3, 'La catégorie est requise'),
  vendeur: z.string().min(3, 'Le vendeur est requis'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = (data: ProductFormData) => {
    if (!imageUri) {
        Alert.alert("Erreur", "Veuillez sélectionner une image pour le produit.");
        return;
    }
    setIsLoading(true);
    console.log('Product data:', { ...data, image: imageUri });
    // Ici, appeler l'API pour ajouter le produit
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Succès', 'Produit ajouté !');
      router.back();
    }, 1500);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={typography.h2}>Nouveau Produit</Text>
        
        <StyledButton title={imageUri ? "Changer l'image" : "Sélectionner une image"} onPress={pickImage} variant="secondary" />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        
        <Controller control={control} name="name" render={({ field: { onChange, value } }) => <StyledInput placeholder="Nom du produit" onChangeText={onChange} value={value} error={errors.name?.message} />} />
        <Controller control={control} name="price" render={({ field: { onChange, value } }) => <StyledInput placeholder="Prix (€)" onChangeText={(text) => onChange(Number(text))} value={String(value || '')} keyboardType="numeric" error={errors.price?.message} />} />
        <Controller control={control} name="stock" render={({ field: { onChange, value } }) => <StyledInput placeholder="Stock disponible" onChangeText={(text) => onChange(Number(text))} value={String(value || '')} keyboardType="numeric" error={errors.stock?.message} />} />
        <Controller control={control} name="category" render={({ field: { onChange, value } }) => <StyledInput placeholder="Catégorie" onChangeText={onChange} value={value} error={errors.category?.message} />} />
        <Controller control={control} name="vendeur" render={({ field: { onChange, value } }) => <StyledInput placeholder="Vendeur" onChangeText={onChange} value={value} error={errors.vendeur?.message} />} />
        <Controller control={control} name="description" render={({ field: { onChange, value } }) => <StyledInput placeholder="Description (optionnel)" onChangeText={onChange} value={value} multiline numberOfLines={4} error={errors.description?.message} />} />

        <StyledButton title="Ajouter le produit" onPress={handleSubmit(handleAddProduct)} loading={isLoading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.md },
  imagePreview: { width: '100%', height: 200, borderWidth: 2, borderColor: colors.border, alignSelf: 'center' }
});