import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ProductDTO } from '../dtos/ProductDTO';

interface CardProps {
  product: ProductDTO;
  onPress: () => void;
}

export const Card: React.FC<CardProps> = ({ product, onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        { 
          top: pressed ? 2 : 0, 
          left: pressed ? 2 : 0 
        }
      ]}
    >
      <View style={styles.shadow} />
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    top: 4,
    left: 4,
    zIndex: -1,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...typography.h3,
    flex: 1, // Pour que le texte ne pousse pas le prix hors de l'écran
  },
  price: {
    ...typography.h3,
    color: colors.secondary,
  },
});