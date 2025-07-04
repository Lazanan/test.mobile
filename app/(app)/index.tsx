import React, { useState, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Card } from '../../src/components/Card';
import { productApi } from '../../src/api/productApi';
import { ProductDTO } from '../../src/dtos/ProductDTO';
import { useRouter, useFocusEffect, Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { colors, spacing } from '../../src/theme';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { MasonryFlashList } from '@shopify/flash-list';
import { useProducts } from '@/src/hooks/useProducts';
import { RefreshControl } from 'react-native';

export default function ProductListScreen() {
  // On récupère l'état directement depuis le contexte !
  const { products, isLoading, loadProducts } = useProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  }

  if (isLoading && products.length === 0) {
    return <LoadingIndicator />;
  }

  const handleProductPress = (id: string) => {
    router.push(`/products/${id}` as Href);
  };

  const handleAddPress = () => {
    router.push('/products/add');
  };

  return (
    <Screen style={{ paddingHorizontal: spacing.sm }}>
      <View style={styles.flashlistContainer}>
        <MasonryFlashList
          data={products}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <Card product={item} onPress={() => handleProductPress(item.id)} />
          )}
          estimatedItemSize={225}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <Pressable style={styles.fab} onPress={handleAddPress}>
        <View style={styles.fabShadow} />
        <Plus color={colors.white} size={32} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  fabShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
    top: 3,
    left: 3,
    borderRadius: 30,
    zIndex: -1,
  },
  flashlistContainer: {
    width: '100%',
    flex: 1
  }
});