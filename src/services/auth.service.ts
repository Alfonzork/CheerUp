import { supabase } from './supabase.service';

export interface User {
  id: string;
  run: string;
  tipo_usuario: 'admin' | 'entrenador' | 'deportista';
}

export const AuthService = {
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },

  logout: (): void => {
    localStorage.removeItem('user');
  }
}; 