import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { colors, spacing } from '@/src/theme';
import { StatusBar } from 'expo-status-bar';

// Étendre ViewProps pour accepter toutes les props d'une View standard
export interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}


export const Screen: React.FC<ScreenProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});