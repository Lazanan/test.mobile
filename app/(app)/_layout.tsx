import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { User, LogOut } from 'lucide-react-native';
import { colors, typography } from '../../src/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function AppLayout() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Products',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { ...typography.h2 },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={() => router.push('/profile')} style={{ marginRight: 16 }}>
              <User color={colors.text} size={24} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'My Profile',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { ...typography.h2 },
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={logout} style={{ marginRight: 16 }}>
              <LogOut color={colors.accent} size={24} />
            </Pressable>
          ),
          presentation: 'modal', // Pour un effet de slide depuis le bas
        }}
      />
      <Stack.Screen
        name="products/[id]"
        options={{
          title: 'Product Details',
          headerBackTitle: 'Back',
          headerTintColor: colors.secondary,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { ...typography.h2 },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="products/add"
        options={{
          title: 'Add New Product',
          presentation: 'modal',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { ...typography.h2 },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}