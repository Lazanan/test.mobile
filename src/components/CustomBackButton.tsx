import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing } from '../theme';

interface CustomBackButtonProps {
  color?: string;
}

export const CustomBackButton: React.FC<CustomBackButtonProps> = ({ color = colors.white }) => {
  const router = useRouter();

  return (
    // Pressable pour gérer l'interaction
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 }, // Effet visuel au clic
      ]}
    >
      <ChevronLeft color={colors.black} size={28} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // Le padding augmente la zone cliquable, ce qui est bon pour l'UX
    padding: spacing.sm,
    marginLeft: spacing.sm, // Marge pour ne pas être collé au bord de l'écran
    color: colors.white,
    // borderWidth: 1,
    // borderColor: colors.white,
    backgroundColor: colors.yellow,
    borderRadius: '100%',
  },
});