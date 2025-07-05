import { Check, Edit3 } from "lucide-react-native";
import { Pressable, View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { useState } from "react";
import { typography } from "@/src/theme/typography";
import { spacing } from "@/src/theme/spacing";

export const EditableField = ({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        {isEditing ? (
          <TextInput
            value={currentValue}
            onChangeText={setCurrentValue}
            style={styles.input}
            autoFocus
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
        <Pressable onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? (
            <Check color={colors.primary} size={22} />
          ) : (
            <Edit3 color={colors.yellow} size={18} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    padding: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.blue,
    marginBottom: spacing.xs,
  },
  fieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldValue: {
    ...typography.body,
    color: colors.black,
    fontFamily: "Lexend-Medium",
  },
  input: {
    ...typography.body,
    color: colors.black,
    fontFamily: "Lexend-Medium",
    flex: 1,
    padding: 0,
    margin: 0,
  },
});
