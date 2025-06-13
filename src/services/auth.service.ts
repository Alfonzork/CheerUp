import { supabase } from './supabase.service';

export interface User {
  id: string;
  run: string;
  tipo_usuario: 'admin' | 'entrenador' | 'deportista';
  nombres: string;
  ap_paterno: string;
  ap_materno: string;
  avatar?: string;
  fecha_nacimiento?: string;
  email?: string;
  fono?: string;
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
  },

  async getUser(id: string): Promise<User> {

      const { data, error } = await supabase
        .from('users')
        .select('id, run, tipo_usuario, nombres, ap_paterno, ap_materno, avatar,email, fono')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
  },
};