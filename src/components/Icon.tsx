import React from 'react';
import { Icon as LucideIcon, LucideProps } from 'lucide-react-native';
import { colors } from '../theme/colors';

// On peut définir des props par défaut pour toutes nos icônes
const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = colors.text;

export const Icon: React.FC<LucideProps> = ({ color = DEFAULT_COLOR, size = DEFAULT_SIZE, ...props }) => {
  // `as any` est utilisé ici car les props de LucideIcon sont dynamiques
  return <LucideIcon color={color} size={size} {...(props as any)} />;
};

// Exemple d'utilisation dans un autre fichier :
// import { Icon } from './Icon';
// import { Mail } from 'lucide-react-native';
// <Icon as={Mail} color="red" />