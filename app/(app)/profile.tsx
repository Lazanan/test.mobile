import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { useAuth } from '../../src/hooks/useAuth';
import { typography, colors, spacing } from '../../src/theme';
import { User, Mail, Hash } from 'lucide-react-native';
import { StyledButton } from '../../src/components/StyledButton';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    // Ne devrait jamais arriver si la route est bien protégée, mais c'est une sécurité
    return (
      <Screen style={styles.centered}>
        <Text>Utilisateur non trouvé.</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={60} color={colors.secondary} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.infoRow}>
          <Mail size={20} color={colors.text} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Hash size={20} color={colors.text} />
          <Text style={styles.infoText}>ID: {user.id}</Text>
        </View>
      </View>

      <View style={{ marginTop: 'auto' }}>
        <StyledButton title="Log Out" onPress={logout} variant="danger" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  container: { padding: spacing.lg, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  name: { ...typography.h1, color: colors.text },
  email: { ...typography.body, color: colors.text, opacity: 0.6 },
  infoSection: { marginTop: spacing.xl, gap: spacing.md },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, padding: spacing.md, borderWidth: 2, borderColor: colors.border },
  infoText: { ...typography.body, flex: 1 },
});