import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Screen } from "@/src/components/global/Screen";
import { typography, colors, spacing } from "@/src/theme";
import { User, Package, DollarSign, LogOut, ArrowRight } from "lucide-react-native";
import { LoadingIndicator } from "@/src/components/global/LoadingIndicator";
import { formatCurrency } from "@/src/utils/formatter";
import { EditableField } from "@/src/components/profile/EditableField";
import { useHandleProfile } from "@/src/hooks/useHandleProfile";
import { Href, useRouter } from "expo-router";
import { ConfirmModal } from "@/src/components/global/ConfirmModal";

// Le composant de l'écran de profil
export default function ProfileScreen() {
  const { user, userStats, handleLogOut, handleUpdate } = useHandleProfile();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter()

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
            <Text style={styles.statValue}>
              {formatCurrency(userStats.totalStockValue)}
            </Text>
            <Text style={styles.statLabel}>Valeur du Stock</Text>
          </View>
        </View>

        <Pressable style={styles.myProductsLink} onPress={() => router.push(`products/myproducts/${user.id}` as Href)}>
          <Text style={styles.myProductsLinkLabel}>Voir Mes Produits</Text>
          <ArrowRight color={colors.yellow}/>
        </Pressable>

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

      {/* Bouton de déconnexion*/}
        <Pressable style={styles.logoutStyle} onPress={() => setModalVisible(true)}>
          <LogOut color={colors.yellow}/>
        </Pressable>

      {/* Modal de confirmation */}
      <ConfirmModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogOut}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
      />
      
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
    marginBottom: spacing.md,
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
  logoutButtonContainer: {
    padding: spacing.md,
    marginTop: "auto",
    flexDirection: "row",
  },
  logoutStyle: {
    position: 'absolute',
    borderRadius: 8,
    flexDirection: "row",
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    gap: spacing.md,
    top: 2,
    right: 2,
  },
  myProductsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  myProductsLinkLabel: {
    fontSize: 20,
    color: colors.white,
  }
});
