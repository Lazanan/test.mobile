// src/utils/formatters.ts

/**
 * Formate un nombre en une chaîne de caractères monétaire avec le symbole Euro.
 * Gère les cas où le nombre est undefined ou null.
 * @param value - Le nombre à formater.
 * @returns Une chaîne de caractères formatée ".
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B €`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k €`;
  }
  return `${value.toFixed(2)} €`;
}
