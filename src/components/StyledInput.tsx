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

export const StyledInput: React.FC<StyledInputProps> = ({ leftIcon, error, label, style, value, ...props }) => {
  const showSuccess = !error && value;

  return (
    <View>
      {label ? (
        <View style={styles.labelContainer}>
          {leftIcon && <>{leftIcon}</>}
          <Text style={styles.label}>{label}</Text>
        </View>
      ) : null}

      <View style={[
        styles.container,
        error ? styles.errorBorder : showSuccess ? styles.successBorder : null
      ]}>
        <TextInput
          style={[typography.body, styles.input, style]}
          placeholderTextColor={colors.black + '80'}
          value={value}
          {...props}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {showSuccess && <Text style={styles.successText}>✓ Champ valide</Text>}
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
  },
  errorBorder: {
    borderColor: colors.accent,
    borderWidth: 1,
  },
  successBorder: {
    borderColor: 'green',
    borderWidth: 1,
  },
  successText: {
    ...typography.caption,
    color: 'green',
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});