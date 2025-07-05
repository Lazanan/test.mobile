import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Screen } from "../../src/components/global/Screen";
import { StyledButton } from "../../src/components/global/StyledButton";
import { StyledInput } from "../../src/components/global/StyledInput";
import { useAuth } from "../../src/hooks/useAuth";
import { typography, colors, spacing } from "../../src/theme";
import { Mail, Lock } from "lucide-react-native";
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // appel api
      await login(email, password);
      // redirection automatique vers le product list gere' par le layout racine
    } catch (error: any) {
      Alert.alert(
        "Erreur de connexion",
        error.message || "Une erreur est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
    >
      <Screen style={styles.container}>
        <View>
          <Text style={styles.title}>Bon retour !</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder au catalogue.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <StyledInput
            placeholder="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail color={colors.text} size={20} />}
            label="E-mail"
          />
          <StyledInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock color={colors.text} size={20} />}
            label="Mot de passe"
          />
          <StyledButton
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>

        <Link href="/signup" asChild>
          <Pressable>
            <Text style={styles.link}>
              Vous n’avez pas de compte ?{" "}
              <Text
                style={{ fontFamily: "Lexend-Bold", color: colors.secondary }}
              >
                Inscrivez-vous
              </Text>
            </Text>
          </Pressable>
        </Link>
      </Screen>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: "center",
    opacity: 0.7,
    marginTop: spacing.sm,
  },
  formContainer: {
    gap: spacing.md,
  },
  link: {
    ...typography.body,
    textAlign: "center",
    color: colors.text,
    padding: spacing.md,
  },
});
