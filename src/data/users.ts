// Interface décrivant la structure d'un enregistrement utilisateur dans notre "base de données"
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // On ne stocke JAMAIS le mot de passe en clair
}

// Notre "base de données" d'utilisateurs sous forme de tableau.
// Dans une vraie application, cela viendrait d'une base de données distante.
// Les hashes ont été générés avec bcryptjs pour les mots de passe indiqués en commentaire.
export const usersDB: UserRecord[] = [
  {
    id: "1",
    email: "test@example.com",
    name: "John Doe",
    // Hash pour "password123"
    passwordHash: "password123"
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    // Hash pour "adminpass"
    passwordHash: "adminpass"
  },
];


// Pour générer ces hashes, vous pouvez utiliser un simple script Node.js une seule fois:
/*
  const bcrypt = require('bcryptjs');
  const password = 'password123';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log(hash); // Copiez/collez cette valeur
*/