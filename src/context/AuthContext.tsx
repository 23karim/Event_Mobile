import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import { User } from '../models/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadStorageData();
  }, []);
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)'); 
    }
  }, [user, segments, isLoading]);

const loadStorageData = async () => {
  try {
    const jsonUser = await SecureStore.getItemAsync('user');
    if (jsonUser) {
      const parsedUser = JSON.parse(jsonUser);
  
      if (parsedUser.role === 'admin') {
        await authService.logout(); 
        setUser(null);
      } else {
        setUser(parsedUser);
      }
    }
  } catch (error) {
    console.error("Erreur chargement stockage", error);
  } finally {
    setIsLoading(false);
  }
};

  const signIn = async (email: string, password: string) => {
    const { authService } = await import('../services/authService');
    const data = await authService.login(email, password);
    setUser(data.user);
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};