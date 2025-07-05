// src/components/Stepper.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <View style={styles.container}>
      {stepNames.map((name, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <React.Fragment key={step}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.activeCircle,
                  isCompleted && styles.completedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.activeText,
                    isCompleted && styles.completedText,
                  ]}
                >
                  {isCompleted ? '✓' : step}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepName,
                  isActive && styles.activeName,
                ]}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
            {step < totalSteps && <View style={[styles.line, isCompleted && styles.lineCompleted]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
    maxWidth: 80, // Limite la largeur du texte
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activeCircle: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  completedCircle: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  stepText: {
    ...typography.body,
    color: colors.blue,
    fontWeight: 'bold',
  },
  activeText: {
    color: colors.white,
  },
  completedText: {
    color: colors.primary,
    fontSize: 16,
  },
  stepName: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
  },
  activeName: {
    color: colors.primary,
    fontWeight: 'bold',
    opacity: 1,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.blue,
    marginHorizontal: spacing.xs,
    marginTop: 15, // Aligner avec le centre des cercles
    opacity: 0.3
  },
  lineCompleted: {
    backgroundColor: colors.primary,
    opacity: 1,
  },
});