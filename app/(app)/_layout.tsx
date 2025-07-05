import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { User } from "lucide-react-native";

import { colors, spacing, typography } from "@/src/theme";

import { ProductProvider } from "@/src/contexts/ProductContext";

import { CustomBackButton } from "@/src/components/CustomBackButton"; 

export default function AppLayout() {
  const router = useRouter();

  // style par defaut du header
  const defaultScreenOptions = {
    headerStyle: { backgroundColor: colors.blue },
    headerTitleStyle: { ...typography.h3, color: colors.text },
    headerShadowVisible: false,
    headerTitleAlign: "center" as "center", 
  };

  return (
    <ProductProvider>
      <Stack screenOptions={defaultScreenOptions}>
        {/* route racine */}
        <Stack.Screen
          name="index"
          options={{
            title: "Acceuil",
            headerLeft: () =>(
              <Image source={require('@/assets/images/global/logo.png')} style={styles.logoStyle}/>
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

        {/* route profile */}
        <Stack.Screen
          name="profile"
          options={{
            title: "Mon Profil",
            headerLeft: () => <CustomBackButton />,
            presentation: "modal",
          }}
        />

        {/* route detail produit */}
        <Stack.Screen
          name="products/[id]"
          options={{
            title: "Détails du Produit",
            headerLeft: () => <CustomBackButton />,
            headerBackVisible: false, 
          }}
        />

        {/* route ajout produit */}
        <Stack.Screen
          name="products/add/index"
          options={{
            title: "Nouveau Produit",
            headerLeft: () => <CustomBackButton />, 
            presentation: "modal",
          }}
        />

        {/* route modifier produit */}
        <Stack.Screen
          name="products/edit/[id]"
          options={{
            title: "Modifier le Produit",
            presentation: "modal",
            headerLeft: () => <CustomBackButton />, 
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
    borderRadius: 100,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderBlockColor: colors.white,
  },
  logoStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: spacing.sm,
  }
});
