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
  
  const handleEdit = () => {
    // On met à jour la valeur actuelle au cas où la prop 'value' aurait changé depuis le dernier rendu
    setCurrentValue(value);
    setIsEditing(true);
  }

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        {isEditing ? (
          <TextInput
            value={currentValue}
            onChangeText={setCurrentValue}
            style={styles.input}
            autoFocus={true} // <-- AMÉLIORATION UX: Ouvre le clavier et met le focus automatiquement
            onSubmitEditing={handleSave} // Optionnel: sauvegarde en appuyant sur "Entrée"
            blurOnSubmit={false} // Garde le clavier ouvert si on soumet
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
        <Pressable onPress={isEditing ? handleSave : handleEdit}>
          {isEditing ? (
            <Check color={'green'} size={32} />
          ) : (
            <Edit3 color={colors.yellow} size={24} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

// ... vos styles pour EditableField restent inchangés
const styles = StyleSheet.create({
  fieldContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gray',
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
    // On retire la marge pour un meilleur alignement
    marginRight: spacing.sm, 
    padding: 0,
  },
});