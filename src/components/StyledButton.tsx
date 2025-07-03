import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { View } from 'react-native';

// Étendre PressableProps pour accepter toutes les props d'un Pressable
interface StyledButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode,
}

export const StyledButton: React.FC<StyledButtonProps> = ({ icon, title, onPress, variant = 'primary', loading = false, disabled = false, ...props }) => {

  const textColor = variant === 'primary' || variant === 'danger' ? colors.black : colors.text;
  const bgColor = variant === 'primary' || variant === 'danger' ? colors.yellow : colors.blue;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: bgColor,
          // Effet de mouvement au clic
          top: pressed && !isDisabled ? 2 : 0,
          left: pressed && !isDisabled ? 2 : 0,
        },
        isDisabled && styles.disabled,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.buttonStyle}>
            {icon}
            <Text style={[typography.body, styles.text, { color: textColor, fontSize: 15 }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52, // Hauteur fixe pour une meilleure cohérence
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    top: 4,
    left: 4,
    zIndex: -1,
    borderRadius: 12
  },
  text: {
    fontFamily: 'Lexend-Bold', 
  },
  disabled: {
    opacity: 0.5,
  },
  buttonStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }
});