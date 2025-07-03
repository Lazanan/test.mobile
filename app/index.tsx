// import React, { useState, useCallback } from 'react';
// import { FlatList, View, Pressable, StyleSheet } from 'react-native';
// import { Screen } from '../src/components/Screen';
// import { Card } from '../src/components/Card';
// import { productApi } from '../src/api/productApi';
// import { ProductDTO } from '../src/dtos/ProductDTO';
// import { useRouter, useFocusEffect, Href } from 'expo-router'; // <-- Importer Href
// import { Plus } from 'lucide-react-native';
// import { colors, spacing } from '../src/theme';
// import { LoadingIndicator } from '../src/components/LoadingIndicator';

// export default function ProductListScreen() {
//   const [products, setProducts] = useState<ProductDTO[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useFocusEffect(
//     useCallback(() => {
//       const fetchProducts = async () => {
//         setIsLoading(true);
//         try {
//           const data = await productApi.getAll();
//           setProducts(data);
//         } catch (error) {
//           console.error("Failed to fetch products:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchProducts();
//     }, [])
//   );

//   if (isLoading) {
//     return <LoadingIndicator />;
//   }

//   const handleProductPress = (id: string) => {
//     // CORRECTION ICI: On caste la chaîne en type Href
//     router.push(`/products/${id}` as Href);
//   };
  
//   const handleAddPress = () => {
//     router.push('/products/add');
//   };

//   return (
//     <Screen>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <Card product={item} onPress={() => handleProductPress(item.id)} />}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ gap: spacing.md, paddingBottom: 100 }}
//       />
//       <Pressable style={styles.fab} onPress={handleAddPress}>
//         <View style={styles.fabShadow} />
//         <Plus color={colors.white} size={32} />
//       </Pressable>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   fab: {
//     position: 'absolute',
//     bottom: spacing.lg,
//     right: spacing.lg,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: colors.secondary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: colors.border,
//   },
//   fabShadow: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: colors.border,
//     top: 3,
//     left: 3,
//     borderRadius: 30,
//     zIndex: -1,
//   },
// });