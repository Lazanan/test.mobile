import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

interface SearchBarProps extends TextInputProps {}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    // Le conteneur parent sert d'ancre pour le positionnement absolu de l'icône.
    <View style={styles.container}>
      {/* L'icône est maintenant un élément flottant */}
      <View style={styles.iconContainer}>
        <Search size={20} color={colors.blue} strokeWidth={3}/>
      </View>

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.black + '80'}
        placeholder="Rechercher ..."
        selectionColor={colors.blue}
        {...props}
      />
    </View>
  );
};

const ICON_SIZE = 20;
const ICON_MARGIN_LEFT = spacing.md; // 16px
const INPUT_PADDING_LEFT = ICON_MARGIN_LEFT + ICON_SIZE + spacing.sm; // 16 + 20 + 8 = 44px

const styles = StyleSheet.create({
  container: {
    // Le conteneur n'a plus besoin de flexDirection ou alignItems,
    // car il ne contient qu'un seul élément dans le flux : le TextInput.
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 12,
    height: 48,
    width: '85%',
    // Il est l'ancre pour le positionnement de l'icône
    justifyContent: 'center', // Centre le TextInput verticalement
  },
  iconContainer: {
    position: 'absolute',
    left: ICON_MARGIN_LEFT,
    // Centre l'icône verticalement dans le conteneur
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    // zIndex assure que l'icône est au-dessus de l'input si nécessaire (pas le cas ici)
    zIndex: 1,
  },
  input: {
    height: '100%',
    ...typography.body,
    color: colors.black,
    
    // CORRECTION PRINCIPALE : On ajoute un padding à gauche pour faire de la place à l'icône.
    // Ce padding doit être calculé pour être plus grand que l'espace pris par l'icône.
    paddingLeft: INPUT_PADDING_LEFT,
    paddingRight: spacing.md, // Garder un padding à droite

    // Style pour enlever l'outline sur le web
    // @ts-ignore
    outlineColor: colors.blue,
  },
});