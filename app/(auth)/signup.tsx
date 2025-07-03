import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { StyledButton } from '../../src/components/StyledButton';
import { StyledInput } from '../../src/components/StyledInput';
import { useAuth } from '../../src/hooks/useAuth';
import { typography, colors, spacing } from '../../src/theme';
import { User, Mail, Lock } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Définir le schéma de validation avec Zod
const signupSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  // Remplacer signup par une vraie fonction dans le AuthContext si vous l'implémentez
  // Pour l'instant, on simule une redirection
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleSignup = (data: SignupFormData) => {
    setIsLoading(true);
    console.log('Signup data:', data);
    // Ici, vous appelleriez votre fonction signup de l'API/contexte
    // ex: await signup(data.name, data.email, data.password);
    setTimeout(() => {
      Alert.alert('Succès', 'Compte créé ! Vous pouvez maintenant vous connecter.', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Screen style={styles.container}>
      <View>
        <Text style={styles.title}>Create Account.</Text>
        <Text style={styles.subtitle}>Join us to start managing your products.</Text>
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              placeholder="Full Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              leftIcon={<User color={colors.text} size={20} />}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              placeholder="Email Address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail color={colors.text} size={20} />}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledInput
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              leftIcon={<Lock color={colors.text} size={20} />}
              error={errors.password?.message}
            />
          )}
        />
        <StyledButton title="Create My Account" onPress={handleSubmit(handleSignup)} loading={isLoading} disabled={isLoading} />
      </View>

      <Link href="/login" asChild>
        <Pressable>
          <Text style={styles.link}>
            Already have an account?{' '}
            <Text style={{ fontFamily: 'Lexend-Bold', color: colors.secondary }}>Log In</Text>
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
// Les styles sont très similaires à ceux de LoginScreen
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: spacing.lg },
  title: { ...typography.h1, color: colors.text, textAlign: 'center', marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.text, textAlign: 'center', opacity: 0.7, marginTop: spacing.sm },
  formContainer: { gap: spacing.md },
  link: { ...typography.body, textAlign: 'center', color: colors.text, padding: spacing.md },
});