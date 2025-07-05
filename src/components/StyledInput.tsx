import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// Étendre TextInputProps pour accepter toutes les props d'un TextInput
interface StyledInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  error?: string;
  label?: string
}

export const StyledInput: React.FC<StyledInputProps> = ({ leftIcon, error, style, label, ...props }) => {
  return (
    <View>
      <View style={styles.labelContainer}>
        {leftIcon && <>{leftIcon}</>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.container, error ? styles.errorBorder : {}]}>
        <TextInput
          style={[typography.body, styles.input, style]}
          placeholderTextColor={colors.black + '80'} // Noir avec 50% d'opacité
          {...props}
        />
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
    height: 52, // Hauteur fixe pour aligner avec les boutons
    borderRadius: 12,
    color: colors.black,
    minWidth: 100,
  },
  iconContainer: {
    paddingLeft: spacing.md,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.black,
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
  labelContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    marginBottom: 8,
  },
  label: {
    color: colors.white,
    fontSize: 18,
  }
});