import React, { useState, useEffect } from 'react';
import { Alert, Text, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Edit } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { ProductForm, ProductFormData } from '@/src/components/ProductForm';
import { LoadingIndicator } from '@/src/components/LoadingIndicator';
import { productApi } from '@/src/api/productApi';
import { ProductDTO } from '@/src/dtos/ProductDTO';
import { typography, colors, spacing } from '@/src/theme';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Pour le chargement initial
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour la soumission

  // Étape 1: Récupérer les données du produit à modifier
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const data = await productApi.getById(id);
        if (data) {
          setProduct(data);
        } else {
          Alert.alert("Erreur", "Produit non trouvé.", [{ text: "OK", onPress: () => router.back() }]);
        }
        setIsLoadingData(false);
      };
      fetchProduct();
    } else {
        // Si aucun ID n'est fourni, on ne peut rien faire
        Alert.alert("Erreur", "Aucun identifiant de produit fourni.", [{ text: "OK", onPress: () => router.back() }]);
    }
  }, [id]);

  // Étape 2: Définir la logique de mise à jour
  const handleUpdateProduct = async (data: ProductFormData, imageUri: string) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const updateData = { ...data, image: imageUri };
      await productApi.updateProduct(id, updateData);

      Alert.alert("Succès", "Les modifications ont été enregistrées.");
      router.back();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de sauvegarder les modifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un indicateur de chargement tant que les données du produit ne sont pas prêtes
  if (isLoadingData) {
    return <LoadingIndicator />;
  }

  // Sécurité au cas où le produit n'a pas pu être chargé
  if (!product) {
    return <Screen><Text style={{color: colors.text}}>Impossible de charger le produit.</Text></Screen>;
  }

  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Edit color={colors.blue} />
        <Text style={styles.title}>Modifier le Produit</Text>
      </View>

      {/* Étape 3: On affiche le même formulaire, mais en lui passant le produit à éditer */}
      <ProductForm
        product={product}
        onSubmit={handleUpdateProduct}
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