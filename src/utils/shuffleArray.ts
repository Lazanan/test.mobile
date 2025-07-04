export const shuffleArray = <T>(array: T[]): T[] => {
  // On commence par la fin du tableau
  for (let i = array.length - 1; i > 0; i--) {
    // On choisit un index aléatoire parmi les éléments restants (de 0 à i)
    const j = Math.floor(Math.random() * (i + 1));
    
    // On échange l'élément actuel (i) avec l'élément aléatoire (j)
    // C'est une syntaxe de déstructuration moderne pour échanger deux variables.
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};