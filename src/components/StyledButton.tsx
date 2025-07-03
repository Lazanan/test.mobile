import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator, PressableProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Étendre PressableProps pour accepter toutes les props d'un Pressable
interface StyledButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, variant = 'primary', loading = false, disabled = false, ...props }) => {
  const buttonBackgroundColor = {
    primary: colors.primary,
    secondary: colors.white,
    danger: colors.accent,
  }[variant];

  const textColor = variant === 'primary' || variant === 'danger' ? colors.white : colors.text;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: buttonBackgroundColor,
          // Effet de mouvement au clic
          top: pressed && !isDisabled ? 2 : 0,
          left: pressed && !isDisabled ? 2 : 0,
        },
        isDisabled && styles.disabled,
      ]}
      {...props}
    >
      <View style={styles.shadow} />
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[typography.body, styles.text, { color: textColor, fontSize: 11 }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52, // Hauteur fixe pour une meilleure cohérence
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
    top: 4,
    left: 4,
    zIndex: -1,
  },
  text: {
    fontFamily: 'Lexend-Bold', // Police en gras pour les boutons
  },
  disabled: {
    opacity: 0.5,
  },
});