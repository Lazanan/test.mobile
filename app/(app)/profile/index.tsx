import React from "react";
import { View, Text, StyleSheet} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Screen } from "@/src/components/Screen";
import { typography, colors, spacing } from "@/src/theme";
import { User, Package, DollarSign } from "lucide-react-native";
import { StyledButton } from "@/src/components/StyledButton";
import { LoadingIndicator } from "@/src/components/LoadingIndicator";
import { formatCurrency } from "@/src/utils/formatter";
import { EditableField } from "@/src/components/profile/EditableField";
import { useHandleProfile } from "@/src/hooks/useHandleProfile";

// Le composant principal de l'écran de profil
export default function ProfileScreen() {
  const { user, userStats, logout, handleUpdate } = useHandleProfile();

  if (!user) {
    return <LoadingIndicator />;
  }

  return (
    <Screen style={styles.screen}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100} 
        enableOnAndroid={true}
      >
        {/*Section Header*/}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={60} color={colors.black} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/*Section Statistiques*/}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Package size={28} color={colors.primary} />
            <Text style={styles.statValue}>{userStats.productCount}</Text>
            <Text style={styles.statLabel}>Produits en Vente</Text>
          </View>

          <View style={styles.statCard}>
            <DollarSign size={28} color={colors.secondary} />
            {/* Utilisation de la fonction de formatage pour l'argent */}
            <Text style={styles.statValue}>
              {formatCurrency(userStats.totalStockValue)}
            </Text>
            <Text style={styles.statLabel}>Valeur du Stock</Text>
          </View>
        </View>

        {/*Section Informations et Modification*/}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Mon Profil</Text>
          <EditableField
            label="Nom d'utilisateur"
            value={user.name}
            onSave={(newValue) => handleUpdate("name", newValue)}
          />
          <EditableField
            label="Adresse Email"
            value={user.email}
            onSave={(newValue) => handleUpdate("email", newValue)}
          />
        </View>
      </KeyboardAwareScrollView>

      {/*Bouton de déconnexion*/}
      <View style={styles.logoutButtonContainer}>
        <StyledButton title="Déconnexion" onPress={logout} variant="danger" />
      </View>
    </Screen>
  );
}

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
  logoutButtonContainer: { padding: spacing.md, marginTop: "auto" },
});
