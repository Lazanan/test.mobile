import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Screen } from "../../src/components/global/Screen";
import { StyledButton } from "../../src/components/global/StyledButton";
import { StyledInput } from "../../src/components/global/StyledInput";
import { useAuth } from "../../src/hooks/useAuth";
import { typography, colors, spacing } from "../../src/theme";
import { User, Mail, Lock } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Schéma de validation avec Zod
const signupSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  // utilisation de hook form pour gerer le formulaire
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // logique inscription
  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    console.log("Signup data:", data);
    await signup(data.name, data.email, data.password);

    setTimeout(() => {
      Alert.alert(
        "Succès",
        "Compte créé ! Vous pouvez maintenant vous connecter.",
        [{ text: "OK", onPress: () => router.push("/login") }]
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
    >
      <Screen style={styles.container}>
        <View>
          <Text style={styles.title}>Creer Un Compte.</Text>
          <Text style={styles.subtitle}>
            Rejoignez nous pour commencer a gerer vos produits.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledInput
                placeholder="Nom d'utilisateur"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={<User color={colors.text} size={20} />}
                error={errors.name?.message}
                label="Nom"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledInput
                placeholder="email@exemple.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail color={colors.text} size={20} />}
                error={errors.email?.message}
                label="Adresse Email"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledInput
                placeholder="votre mot de passe"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                leftIcon={<Lock color={colors.text} size={20} />}
                error={errors.password?.message}
                label="Mot de passe"
              />
            )}
          />
          <StyledButton
            title="Creer Mon Compte"
            onPress={handleSubmit(handleSignup)}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>

        <Link href="/login" asChild>
          <Pressable>
            <Text style={styles.link}>
              Vous avez un compte?{" "}
              <Text
                style={{ fontFamily: "Lexend-Bold", color: colors.secondary }}
              >
                Se Connecter
              </Text>
            </Text>
          </Pressable>
        </Link>
      </Screen>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: spacing.lg },
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
  formContainer: { gap: spacing.md },
  link: {
    ...typography.body,
    textAlign: "center",
    color: colors.text,
    padding: spacing.md,
  },
});
