import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'basic' | 'standard' | 'premium';
  watchHistory: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  addToWatchHistory: (movieId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação salva
    const checkAuth = async () => {
      try {
        // Em um app real, verificar AsyncStorage ou armazenamento seguro
        // Para demonstração, vamos simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de login bem-sucedido
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          plan: 'basic',
          watchHistory: []
        };
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de registro bem-sucedido
      if (email && password && name) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          plan: 'basic',
          watchHistory: []
        };
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return !!email;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addToWatchHistory = (movieId: string) => {
    if (user && !user.watchHistory.includes(movieId)) {
      updateProfile({
        watchHistory: [movieId, ...user.watchHistory].slice(0, 50) // Manter últimos 50 itens
      });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    addToWatchHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};