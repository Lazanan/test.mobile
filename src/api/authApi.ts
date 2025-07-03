// import bcrypt from 'bcryptjs';
import { usersDB, UserRecord } from '../data/users';
import { UserDTO } from '../dtos/UserDTO';

// =================================================================================
// == AVERTISSEMENT PROFESSIONNEL                                                 ==
// == Ce code est fourni car il a été demandé explicitement.                      ==
// == Dans un projet réel, BCRYPT NE DOIT JAMAIS être exécuté côté client (mobile).==
// == 1. C'est une faille de sécurité.                                            ==
// == 2. Cela gèle l'application et crée une expérience utilisateur terrible.     ==
// == La bonne pratique est de faire le hachage sur un serveur distant (backend). ==
// =================================================================================

const login = (email: string, password: string): Promise<{ token: string; user: UserDTO }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simule la latence du réseau
      const userRecord = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userRecord) {
        return reject(new Error('Email ou mot de passe incorrect.'));
      }

      // Comparaison du mot de passe (opération lente et bloquante)
      const isPasswordValid = password === userRecord.passwordHash;
      if (!isPasswordValid) {
        return reject(new Error('Email ou mot de passe incorrect.'));
      }

      // On ne renvoie que le DTO, sans le hash du mot de passe
      const user: UserDTO = { id: userRecord.id, name: userRecord.name, email: userRecord.email };
      // Simule un token JWT
      const token = `fake-jwt-for-${user.id}-${Date.now()}`;
      
      resolve({ token, user });
    }, 1500); // Latence de 1.5s pour voir l'indicateur de chargement
  });
};

const signup = (name: string, email: string, password: string): Promise<{ token: string; user: UserDTO }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (usersDB.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return reject(new Error('Cet email est déjà utilisé.'));
            }

            // const salt = bcrypt.genSaltSync(10);
            // const passwordHash = bcrypt.hashSync(password, salt);
            const passwordHash = password;
            
            const newUserRecord: UserRecord = {
                id: String(Date.now()),
                name,
                email,
                passwordHash,
            };

            usersDB.push(newUserRecord);
            console.log("New user added to mock DB:", newUserRecord);

            const user: UserDTO = { id: newUserRecord.id, name: newUserRecord.name, email: newUserRecord.email };
            const token = `fake-jwt-for-${user.id}-${Date.now()}`;
            
            resolve({ token, user });
        }, 1500);
    });
};


export const authApi = {
  login,
  signup
};