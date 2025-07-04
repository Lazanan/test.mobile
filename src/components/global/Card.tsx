import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, typography } from "@/src/theme";
import { ProductDTO } from "../../dtos/ProductDTO";
import { MoreVertical, X, Edit3Icon, Info, Trash } from "lucide-react-native"; 
import { Href, useRouter } from "expo-router";

// type props
interface CardProps {
  product: ProductDTO;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const Card: React.FC<CardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();

  // Simule des hauteurs d'image variables pour l'effet Masonry
  const imageHeight = parseInt(product.id, 10) % 2 === 0 ? 250 : 200;

  const handleOpenMenu = () => {
    setIsMenuVisible(true);
  };

  const handleEditPress = () => {
    setIsMenuVisible(false);
    onEdit();
  };

  const handleDeletePress = () => {
    setIsMenuVisible(false);
    onDelete();
  };

  const handleViewDetailsPress = () => {
    router.push(`products/${product.id}` as Href);
  };

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressableContainer,
          { top: pressed ? 1 : 0, left: pressed ? 1 : 0 },
        ]}
      >
        <View style={styles.shadow} />

        {/* image du produit */}
        <ImageBackground
          source={{ uri: product.image }}
          style={[styles.container, { height: imageHeight }]}
          imageStyle={styles.image}
        >
          {/* Edit button */}
          <Pressable onPress={handleOpenMenu} style={styles.moreButton}>
            <MoreVertical color={colors.white} size={24} />
          </Pressable>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          >
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
          </LinearGradient>
        </ImageBackground>
      </Pressable>

      {/* Modal pour le menu d'options */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        {/* L'arrière-plan semi-transparent qui ferme la modale au clic */}
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={handleViewDetailsPress}>
              <Info size={20} color={colors.yellow} />
              <Text style={[styles.menuItemText, { color: colors.white }]}>
                Voir détails
              </Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={handleEditPress}>
              <Edit3Icon size={20} color={colors.yellow} />
              <Text style={styles.menuItemText}>Changer info</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem} onPress={handleDeletePress}>
              <Trash size={20} color={colors.accent} />
              <Text style={[styles.menuItemText, { color: colors.accent }]}>
                Supprimer
              </Text>
            </Pressable>
            <Pressable onPress={() => setIsMenuVisible(false)} style={styles.closeIcon}>
              <X size={28} color={colors.white} />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  image: {
    borderRadius: 10,
  },
  gradient: {
    width: "100%",
    padding: spacing.md,
  },
  name: {
    ...typography.h3,
    fontFamily: "Lexend-Bold",
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  price: {
    ...typography.body,
    fontFamily: "Lexend-Regular",
    color: colors.primary,
    marginTop: spacing.xs,
  },
  // Styles pour la modale
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: "60%",
    backgroundColor: "#1b263b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    padding: spacing.sm,
    opacity: 0.8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  menuItemText: {
    ...typography.body,
    color: colors.text,
    fontFamily: "Lexend-Medium",
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
  },
  moreButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
    backgroundColor: "rgba(0,0,0,0.3)", // Fond semi-transparent pour la lisibilité
    borderRadius: 20,
    zIndex: 2,
  },
  closeIcon : {
    position: "absolute",
    top: 2,
    right: 2,
  }
});
