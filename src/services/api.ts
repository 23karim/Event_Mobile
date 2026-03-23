import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = "http://172.20.28.189:5000"; // 10.0.2.2 pour Android, localhost pour iOS

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le Token automatiquement dans chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;