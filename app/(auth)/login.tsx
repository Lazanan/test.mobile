import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { StyledButton } from '../../src/components/StyledButton';
import { StyledInput } from '../../src/components/StyledInput';
import { useAuth } from '../../src/hooks/useAuth';
import { typography, colors, spacing } from '../../src/theme';
import { Mail, Lock } from 'lucide-react-native';
import { Link, router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
      // redirection vers le product list
      router.replace("/");
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome Back.</Text>
        <Text style={styles.subtitle}>Log in to access your product catalog.</Text>
      </View>

      <View style={styles.formContainer}>
        <StyledInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail color={colors.text} size={20} />}
        />
        <StyledInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock color={colors.text} size={20} />}
        />
        <StyledButton title="Log In Securely" onPress={handleLogin} loading={isLoading} disabled={isLoading} />
      </View>
      
      <Link href="/signup" asChild>
        <Pressable>
          <Text style={styles.link}>
            Don't have an account?{' '}
            <Text style={{ fontFamily: 'Lexend-Bold', color: colors.secondary }}>Sign Up</Text>
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: spacing.sm,
  },
  formContainer: {
    gap: spacing.md,
  },
  link: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text,
    padding: spacing.md,
  },
});