export interface User {
  id: string;
  nom: string;
  role: 'admin' | 'client';
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}