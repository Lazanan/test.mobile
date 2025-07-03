import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Étendre TextInputProps pour accepter toutes les props d'un TextInput
interface StyledInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  error?: string;
}

export const StyledInput: React.FC<StyledInputProps> = ({ leftIcon, error, style, ...props }) => {
  return (
    <View>
      <View style={[styles.container, error ? styles.errorBorder : {}]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[typography.body, styles.input, style]}
          placeholderTextColor={colors.text + '80'} // Noir avec 50% d'opacité
          {...props}
        />
        <View style={styles.shadow} />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    height: 52, // Hauteur fixe pour aligner avec les boutons
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
    top: 4,
    left: 4,
    zIndex: -1,
  },
  iconContainer: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  errorBorder: {
    borderColor: colors.accent,
  },
  errorText: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});