import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../src/components/Screen';
import { productApi } from '../../../src/api/productApi';
import { ProductDTO } from '../../../src/dtos/ProductDTO';
import { LoadingIndicator } from '../../../src/components/LoadingIndicator';
import { typography, colors, spacing } from '../../../src/theme';
import { Tag, Package, User, DollarSign } from 'lucide-react-native';
import { StyledButton } from '../../../src/components/StyledButton';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        const data = await productApi.getById(id);
        if (data) {
          setProduct(data);
        }
        setIsLoading(false);
      };
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!product) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={typography.h2}>Produit non trouvé</Text>
      </Screen>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le produit",
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => {
            // Ici, appeler l'API de suppression
            console.log(`Deleting product ${product.id}`);
            router.back();
        }}
      ]
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.infoGrid}>
            <InfoChip icon={<DollarSign size={18} color={colors.secondary}/>} label="Prix" value={`${product.price.toFixed(2)} €`} />
            <InfoChip icon={<Package size={18} color={colors.secondary}/>} label="Stock" value={String(product.stock)} />
            <InfoChip icon={<Tag size={18} color={colors.secondary}/>} label="Catégorie" value={product.category} />
            <InfoChip icon={<User size={18} color={colors.secondary}/>} label="Vendeur" value={product.vendeur} />
          </View>
        </View>
        <View style={styles.actions}>
            <StyledButton title="Modifier" onPress={() => { /* Navigation vers l'écran de modification */ }} variant="secondary" />
            <StyledButton title="Supprimer" onPress={handleDelete} variant="danger" />
        </View>
      </ScrollView>
    </Screen>
  );
}

const InfoChip = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <View style={styles.chip}>
    <View style={styles.chipHeader}>
        {icon}
        <Text style={styles.chipLabel}>{label}</Text>
    </View>
    <Text style={styles.chipValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  image: { width: '100%', height: 300, backgroundColor: colors.white },
  content: { padding: spacing.md },
  name: { ...typography.h1, marginBottom: spacing.sm },
  description: { ...typography.body, opacity: 0.8, lineHeight: 22, marginBottom: spacing.lg },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  chip: { flexBasis: '47%', backgroundColor: colors.white, padding: spacing.md, borderWidth: 2, borderColor: colors.border, gap: spacing.sm },
  chipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chipLabel: { ...typography.caption, textTransform: 'uppercase' },
  chipValue: { ...typography.h3 },
  actions: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, marginTop: spacing.lg },
});