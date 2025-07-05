// Interface décrivant la structure d'un enregistrement utilisateur dans la "base de données"
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string; 
}

// base de données" d'utilisateurs sous forme de tableau.
export const usersDB: UserRecord[] = [
  {
    id: "1",
    email: "test@example.com",
    name: "Daniel",
    passwordHash: "password123"
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    passwordHash: "adminpass"
  },
];
