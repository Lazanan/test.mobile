import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Ce hook personnalisé fournit un accès typé et sécurisé au AuthContext.
// Il garantit que le contexte est utilisé uniquement à l'intérieur de son provider.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};