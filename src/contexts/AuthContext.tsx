import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { UserDTO } from '../dtos/UserDTO';
import storage from '../services/storage';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'état initial depuis le stockage au démarrage de l'app
  useEffect(() => {
    const loadStateFromStorage = async () => {
      const storedToken = await storage.getToken();
      if (storedToken) {
        const storedUser = await storage.getUser();
        if (storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };
    loadStateFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    const { token: apiToken, user: apiUser } = await authApi.login(email, password);
    setToken(apiToken);
    setUser(apiUser);
    // Stocker les nouvelles informations
    await storage.storeToken(apiToken);
    await storage.storeUser(apiUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { token: apiToken, user: apiUser } = await authApi.signup(name, email, password);
    setToken(apiToken);
    setUser(apiUser);
    await storage.storeToken(apiToken);
    await storage.storeUser(apiUser);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    // Nettoyer le stockage
    await storage.removeToken();
    await storage.removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};