import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider} from '../src/contexts/AuthContext';
import { useAuth } from '@/src/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../src/theme/colors';

import { productApi } from '@/src/api/productApi';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { token, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  //états pour suivre l'initialisation des produits et pour savoir si l'application est prête
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Charger les polices personnalisées
  const [fontsLoaded, fontError] = useFonts({
    'Lexend-Bold': require('../assets/fonts/Lexend-Bold.ttf'),
    'Lexend-Light': require('../assets/fonts/Lexend-Light.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend-Medium.ttf'),
    'Lexend-Regular': require('../assets/fonts/Lexend-Regular.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend-SemiBold.ttf'),
  });

  useEffect(() => {
    // Initialisation des données au montage du composant
    productApi.initialize().then(() => {
      setIsDataInitialized(true);
        setAppIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;

    // On attend que les polices soient chargées et que l'authentification soit vérifiée
    if (appIsReady && fontsLoaded && !isAuthLoading && isDataInitialized) {
      SplashScreen.hideAsync();

      const inAuthGroup = segments[0] === '(auth)';

      // Redirection logique
      if (!token && !inAuthGroup) {
        router.replace('/login');
      } else if (token && inAuthGroup) {
        router.replace('/');
      }
    }
  }, [appIsReady, fontsLoaded, fontError, isAuthLoading, isDataInitialized, token, segments]);

  // rendu loading
  if (!appIsReady || !fontsLoaded || isAuthLoading || !isDataInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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