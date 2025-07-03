import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ProductDTO } from '../dtos/ProductDTO';

interface CardProps {
  product: ProductDTO;
  onPress: () => void;
}

export const Card: React.FC<CardProps> = ({ product, onPress }) => {
  // Simule des hauteurs d'image variables pour l'effet Masonry.
  // La hauteur dépend de l'ID pour rester constante pour un même produit.
  const imageHeight = parseInt(product.id, 10) % 2 === 0 ? 250 : 200;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressableContainer,
        {
          top: pressed ? 1 : 0,
          left: pressed ? 1 : 0,
        },
      ]}
    >
      <View style={styles.shadow} />
      <ImageBackground
        source={{ uri: product.image }}
        style={[styles.container, { height: imageHeight }]}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    flex: 1,
    margin: spacing.sm, // Espace entre les cartes
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
    top: 3,
    left: 3,
    borderRadius: 12,
    zIndex: -1,
  },
  container: {
    // width: '100%', // <-- SUPPRIMÉ, c'était la cause du problème.
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    borderRadius: 10,
  },
  gradient: {
    width: '100%',
    padding: spacing.md,
  },
  name: {
    ...typography.h3,
    fontFamily: 'Lexend-Bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  price: {
    ...typography.body,
    fontFamily: 'Lexend-Regular',
    color: colors.primary,
    marginTop: spacing.xs,
  },
});