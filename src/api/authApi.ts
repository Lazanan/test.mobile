import { usersDB, UserRecord } from '../data/users';
import { UserDTO } from '../dtos/UserDTO';

export class AuthService {
  // Connexion utilisateur
  async login(email: string, password: string): Promise<{ token: string; user: UserDTO }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userRecord = usersDB.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!userRecord || userRecord.passwordHash !== password) {
          return reject(new Error('Email ou mot de passe incorrect.'));
        }

        const user: UserDTO = {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
        };

        const token = `fake-jwt-for-${user.id}-${Date.now()}`;
        resolve({ token, user });
      }, 1500);
    });
  }

  // Inscription utilisateur
  async signup(name: string, email: string, password: string): Promise<{ token: string; user: UserDTO }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = usersDB.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
          return reject(new Error('Cet email est déjà utilisé.'));
        }

        const newUser: UserRecord = {
          id: String(Date.now()),
          name,
          email,
          passwordHash: password, // Simulation de hashage
        };

        usersDB.push(newUser);
        console.log("Nouvel utilisateur ajouté à la DB simulée:", newUser);

        const user: UserDTO = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        };

        const token = `fake-jwt-for-${user.id}-${Date.now()}`;
        resolve({ token, user });
      }, 1500);
    });
  }
}

// Instance exportable
export const authApi = new AuthService();
