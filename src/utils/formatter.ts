// src/utils/formatters.ts

/**
 * Formate un nombre en une chaîne de caractères monétaire avec le symbole Euro.
 * Gère les cas où le nombre est undefined ou null.
 * @param value - Le nombre à formater.
 * @returns Une chaîne de caractères formatée (ex: "1 234,56 €") ou "0,00 €".
 */
export const formatCurrency = (value: number | undefined | null): string => {
  // S'assurer que la valeur est un nombre, sinon retourner une valeur par défaut.
  const numberValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  // Utilise l'API d'internationalisation du navigateur/JS pour un formatage robuste.
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(numberValue);
};