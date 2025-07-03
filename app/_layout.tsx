import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider} from '../src/contexts/AuthContext';
import { useAuth } from '@/src/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../src/theme/colors';

import { productApi } from '@/src/api/productApi';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { token, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  // On ajoute un état pour suivre l'initialisation des produits
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // Charger les polices personnalisées
  const [fontsLoaded, fontError] = useFonts({
    'Lexend-Bold': require('../assets/fonts/Lexend-Bold.ttf'),
    'Lexend-Light': require('../assets/fonts/Lexend-Light.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend-Medium.ttf'),
    'Lexend-Regular': require('../assets/fonts/Lexend-Regular.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend-SemiBold.ttf'),
  });

  useEffect(() => {
    // On lance l'initialisation des données au montage du composant
    productApi.initialize().then(() => {
      setIsDataInitialized(true);
    });
  }, []);

  useEffect(() => {
    // Si il y a une erreur de chargement de police, on l'affiche
    if (fontError) throw fontError;

    // On attend que les polices soient chargées et que l'authentification soit vérifiée
    if (fontsLoaded && !isAuthLoading && isDataInitialized) {
      SplashScreen.hideAsync();

      const inAuthGroup = segments[0] === '(auth)';

      // Redirection logique
      if (!token && !inAuthGroup) {
        router.replace('/login');
      } else if (token && inAuthGroup) {
        router.replace('/');
      }
    }
  }, [fontsLoaded, fontError, isAuthLoading, isDataInitialized, token, segments]);

  // Afficher un indicateur de chargement tant que tout n'est pas prêt
  if (!fontsLoaded || isAuthLoading || !isDataInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Une fois chargé, on rend les routes de l'application
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
};

// Le layout racine qui englobe toute l'application avec le contexte d'authentification
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}