import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { User } from "lucide-react-native";

import { colors, spacing, typography } from "@/src/theme";
import { ProductProvider } from "@/src/contexts/ProductContext";
import { CustomBackButton } from "@/src/components/CustomBackButton";

export default function AppLayout() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  const defaultScreenOptions = {
    headerStyle: { backgroundColor: colors.blue },
    headerTitleStyle: { ...typography.h3, color: colors.text },
    headerShadowVisible: false,
    headerTitleAlign: "center" as const,
  };

  // Action de retour personnalisée avec splash
  const onBack = async () => {
    setShowSplash(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // splash 1ms
    router.back();
    setTimeout(() => setShowSplash(false), 300); // attendre un peu pour éviter flicker
  };

  return (
    <ProductProvider>
      <View style={{ flex: 1 }}>
        {showSplash && (
          <View style={styles.splashStyle}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* On garde le Stack monté, mais on l'affiche seulement si le splash est inactif */}
        <View style={{ flex: 1, opacity: showSplash ? 0 : 1 }}>
          <Stack screenOptions={defaultScreenOptions}>
            <Stack.Screen
              name="index"
              options={{
                title: "Accueil",
                headerLeft: () => (
                  <Image
                    source={require("@/assets/images/global/logo.png")}
                    style={styles.logoStyle}
                  />
                ),
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

            <Stack.Screen
              name="profile/index"
              options={{
                title: "Mon Profil",
                headerLeft: () => <CustomBackButton onBack={onBack} />,
                presentation: "modal",
              }}
            />

            <Stack.Screen
              name="products/myproducts/[id]"
              options={{
                title: "Mes produits",
                headerLeft: () => <CustomBackButton onBack={onBack} />,
                presentation: "modal",
              }}
            />

            <Stack.Screen
              name="products/[id]"
              options={{
                title: "Détails du Produit",
                headerLeft: () => <CustomBackButton onBack={onBack} />,
                headerBackVisible: false,
              }}
            />

            <Stack.Screen
              name="products/add/index"
              options={{
                title: "Nouveau Produit",
                headerLeft: () => <CustomBackButton onBack={onBack} />,
                presentation: "modal",
              }}
            />

            <Stack.Screen
              name="products/edit/[id]"
              options={{
                title: "Modifier le Produit",
                headerLeft: () => <CustomBackButton onBack={onBack} />,
                presentation: "modal",
                headerBackVisible: false,
              }}
            />
          </Stack>
        </View>
      </View>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  logoStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: spacing.sm,
  },
  splashStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
