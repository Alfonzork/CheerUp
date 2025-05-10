import { supabase } from './supabase.service';
import { Deportista } from '../models/supabase.model';
// Servicios para Deportistas
export const deportistaService = {
    async getAll() {
      const { data, error } = await supabase
        .from('deportistas_con_equipos')
        .select('*');
      if (error) throw error;
      return data;
    },
  
    async getAllByEquipo(equipoId: string) {
      const { data, error } = await supabase
        .from('deportistas_x_equipo')
        .select('*').eq('equipo_id', equipoId);
      if (error) throw error;
      return data;
    },
  
    async getById(id: string) {
      const { data, error } = await supabase
        .from('deportistas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  
    async create(deportista: any) {
      const { data, error } = await supabase
        .from('users')
        .insert({ ...deportista, activo: true })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  
    async update(id: string, deportista: any) {
      const { data, error } = await supabase
        .from('users')
        .update(deportista)
        .eq('id', id)
        .eq('role', 'deportista')
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: string) {
      const { data, error } = await supabase
        .from('users')
        .update({ activo: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  };