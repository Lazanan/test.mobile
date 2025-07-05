import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@/src/theme';
import { typography } from '@/src/theme';
import { spacing } from '@/src/theme';

interface SearchBarProps extends TextInputProps {}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    // Le conteneur parent sert d'ancre pour le positionnement absolu de l'icône.
    <View style={styles.container}>
      {/* L'icône est maintenant un élément flottant */}
      <View style={styles.iconContainer}>
        <Search size={20} color={colors.yellow} strokeWidth={3}/>
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
const ICON_MARGIN_LEFT = spacing.md; 
const INPUT_PADDING_LEFT = ICON_MARGIN_LEFT + ICON_SIZE + spacing.sm; 

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 12,
    height: 48,
    width: '85%',
    justifyContent: 'center', 
  },
  iconContainer: {
    position: 'absolute',
    left: ICON_MARGIN_LEFT,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    height: '100%',
    ...typography.body,
    color: colors.black,
    paddingLeft: INPUT_PADDING_LEFT,
    paddingRight: spacing.md, 
    outlineColor: colors.blue,
  },
});