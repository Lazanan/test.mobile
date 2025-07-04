import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { User, LogOut } from "lucide-react-native";
import { colors, spacing, typography } from "../../src/theme";
import { useAuth } from "../../src/hooks/useAuth";
import { ProductProvider } from "../../src/contexts/ProductContext";
import { CustomBackButton } from "../../src/components/CustomBackButton"; // <-- Importer notre composant

export default function AppLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  const defaultScreenOptions = {
    headerStyle: { backgroundColor: colors.blue }, // Pour laisser voir le fond Aurora
    headerTitleStyle: { ...typography.h2, color: colors.text },
    headerShadowVisible: false,
    headerTitleAlign: "center" as "center", // Centrer le titre
  };

  return (
    <ProductProvider>
      <Stack screenOptions={defaultScreenOptions}>
        {/* --- Écran sans bouton retour --- */}
        <Stack.Screen
          name="index"
          options={{
            title: "Acceuil",
            headerRight: () => (
              <Pressable
                onPress={() => router.push("/profile")}
                style={{ marginRight: 16 }}
              >
                <View style={styles.avatar}>
                  <User size={24} color={colors.yellow} />
                </View>
              </Pressable>
            ),
          }}
        />

        {/* --- Écrans avec bouton retour personnalisé --- */}
        <Stack.Screen
          name="profile"
          options={{
            title: "Mon Profil",
            headerLeft: () => <CustomBackButton />, // <-- Utilisation du composant
            presentation: "modal",
            // Sur une modale, le bouton de fermeture est géré différemment (souvent un 'X' ou 'Done')
            // mais si elle était un 'push', on utiliserait headerLeft ici aussi.
          }}
        />
        <Stack.Screen
          name="products/[id]"
          options={{
            title: "Détails du Produit",
            headerLeft: () => <CustomBackButton />, // <-- Utilisation du composant
            headerBackVisible: false, // Cache le bouton par défaut
          }}
        />
        <Stack.Screen
          name="products/add"
          options={{
            title: "Nouveau Produit",
            presentation: "modal",
          }}
        />
        {/* Assurez-vous d'avoir un fichier edit/[id].tsx dans le dossier products */}
        <Stack.Screen
          name="products/edit/[id]"
          options={{
            title: "Modifier le Produit",
            presentation: "modal",
            headerLeft: () => <CustomBackButton />, // <-- Utilisation aussi ici
            headerBackVisible: false,
          }}
        />
      </Stack>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
