import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { useAuth } from "../../src/hooks/useAuth";
import { useProducts } from "../../src/hooks/useProducts";
import { typography, colors, spacing } from "../../src/theme";
import { User, Mail, Package, Check, Edit3, DollarSign } from "lucide-react-native";
import { StyledButton } from "../../src/components/StyledButton";
import { LoadingIndicator } from "../../src/components/LoadingIndicator";
import { formatCurrency } from "@/src/utils/formatter";

// Un composant réutilisable pour les champs éditables
const EditableField = ({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        {isEditing ? (
          <TextInput
            value={currentValue}
            onChangeText={setCurrentValue}
            style={styles.input}
            autoFocus
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
        <Pressable onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? (
            <Check color={colors.primary} size={22} />
          ) : (
            <Edit3 color={colors.yellow} size={18} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

// Le composant principal de l'écran de profil
export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const { products } = useProducts();

  if (!user) {
    return <LoadingIndicator />;
  }

  const userStats = useMemo(() => {
    if (!user?.name) return { productCount: 0, totalStockValue: 0 };

    const userProducts = products.filter((p) => p.vendeur === user.name);

    const productCount = userProducts.length;

    const totalStockValue = userProducts.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);

    return {
      productCount,
      totalStockValue,
    };
  }, [products, user.name]);

  const handleUpdate = async (field: "name" | "email", value: string) => {
    try {
      if (value.trim() === "") {
        Alert.alert("Erreur", "Le champ ne peut pas être vide.");
        return;
      }
      await updateUser({ [field]: value });
      Alert.alert("Succès", "Votre profil a été mis à jour.");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        {/* --- Section Header --- */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={60} color={colors.black} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* --- Section Statistiques --- */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Package size={28} color={colors.primary} />
            <Text style={styles.statValue}>{userStats.productCount}</Text>
            <Text style={styles.statLabel}>Produits en Vente</Text>
          </View>

          <View style={styles.statCard}>
            <DollarSign size={28} color={colors.secondary} />
            {/* Utilisation de la fonction de formatage pour un code plus propre */}
            <Text style={styles.statValue}>
              {formatCurrency(userStats.totalStockValue)}
            </Text>
            <Text style={styles.statLabel}>Valeur du Stock</Text>
          </View>
        </View>

        {/* --- Section Informations et Modification --- */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Mon Profil</Text>
          <EditableField
            label="Nom complet"
            value={user.name}
            onSave={(newValue) => handleUpdate("name", newValue)}
          />
          <EditableField
            label="Adresse Email"
            value={user.email}
            onSave={(newValue) => handleUpdate("email", newValue)}
          />
        </View>
      </ScrollView>

      {/* --- Bouton de déconnexion --- */}
      <View style={styles.logoutButtonContainer}>
        <StyledButton title="Déconnexion" onPress={logout} variant="danger" />
      </View>
    </Screen>
  );
}

// Les styles restent les mêmes
const styles = StyleSheet.create({
  screen: { padding: 0 },
  header: { padding: spacing.lg, alignItems: "center" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  userName: { ...typography.h1, color: colors.text },
  statsSection: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.blue,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: { ...typography.h2, color: colors.text, textAlign: "center" },
  statLabel: { ...typography.caption, color: colors.white, opacity: 0.8 },
  infoSection: { paddingHorizontal: spacing.md, gap: spacing.md },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  fieldContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    padding: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.blue,
    marginBottom: spacing.xs,
  },
  fieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldValue: {
    ...typography.body,
    color: colors.black,
    fontFamily: "Lexend-Medium",
  },
  input: {
    ...typography.body,
    color: colors.black,
    fontFamily: "Lexend-Medium",
    flex: 1,
    padding: 0,
    margin: 0,
  },
  logoutButtonContainer: { padding: spacing.md, marginTop: "auto" },
});
