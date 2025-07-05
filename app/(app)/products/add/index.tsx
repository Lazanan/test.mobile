import React, { useState } from 'react';
import { Alert, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { ProductForm, ProductFormData } from '@/src/components/productForm/ProductForm';
import { typography, colors, spacing } from '@/src/theme';

import { useProducts } from '@/src/hooks/useProducts';

export default function AddProductScreen() {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addProduct } = useProducts();

  // Cette fonction sera passée au composant ProductForm
  const handleAddProduct = async (data: ProductFormData, imageUri: string) => {
    setIsSubmitting(true);
    try {
      const productData = { ...data, image: imageUri };
      // Appelle de la fonction du contexte, qui gère l'API ET la mise à jour de l'état
      await addProduct(productData);

      Alert.alert('Succès', `Le produit "${data.name}" a été ajouté.`);
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Une erreur est survenue lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Box color={colors.blue} />
        <Text style={styles.title}>Nouveau Produit</Text>
      </View>
      
      {/* formulaire */}
      <ProductForm
        onSubmit={handleAddProduct}
        isLoading={isSubmitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
});