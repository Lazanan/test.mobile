export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    // Choisir un index aléatoire parmi les éléments restants (de 0 à i)
    const j = Math.floor(Math.random() * (i + 1));
    
    // Echanger element i avec j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};