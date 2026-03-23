
import { AuthResponse } from '../models/auth';
import api from './api';
import * as SecureStore from 'expo-secure-store';


export const authService = {

login: async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/users/signin', { email, password });

    if (data.user.role === 'admin') {
      throw "Accès refusé : Les administrateurs doivent utiliser le dashboard web.";
    }
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    if (data.refreshToken) {
      await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    }
    await SecureStore.setItemAsync('user', JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    if (typeof error === 'string') throw error;
    
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Identifiants incorrects";
  }
},

  signup: async (formData: FormData): Promise<any> => {
    try {
      const { data } = await api.post('/users/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data || error.message);
      throw error.response?.data?.message || "Erreur lors de la création du compte";
    }
  },

  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  getStoredUser: async () => {
    try {
      const user = await SecureStore.getItemAsync('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  getToken: async () => {
    return await SecureStore.getItemAsync('accessToken');
  }
};