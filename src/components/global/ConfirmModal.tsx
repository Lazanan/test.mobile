import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { colors, spacing, typography } from "@/src/theme";

type ConfirmModalProps = {
  visible: boolean;
  onConfirm: (event: GestureResponderEvent) => void;
  onCancel: (event: GestureResponderEvent) => void;
  title?: string;
  message?: string;
};

export function ConfirmModal({
  visible,
  onConfirm,
  onCancel,
  title = "Déconnexion",
  message = "Voulez-vous vraiment vous déconnecter ?",
}: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonCancel,
                pressed && styles.buttonPressedCancel,
              ]}
              onPress={onCancel}
            >
              <Text style={styles.textCancel}>Annuler</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressedConfirm,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.textConfirm}>Oui</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  container: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: colors.background, 
    borderRadius: 16,
    padding: spacing.lg,
    elevation: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    ...typography.h2,
    color: colors.yellow,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressedCancel: {
    backgroundColor: colors.black,
  },
  buttonConfirm: {
    flex: 1,
    backgroundColor: colors.yellow,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressedConfirm: {
    backgroundColor: colors.black,
  },
  textCancel: {
    ...typography.caption,
    color: colors.white,
  },
  textConfirm: {
    ...typography.caption,
    color: colors.black,
    fontWeight: "700",
  },
});
