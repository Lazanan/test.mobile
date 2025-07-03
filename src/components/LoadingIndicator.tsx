import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Screen } from './Screen';

export const LoadingIndicator = () => {
  return (
    <Screen style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});