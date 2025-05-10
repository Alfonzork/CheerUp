import { supabase } from './supabase.service';
import { Tarea } from '../models/supabase.model';

export const tareaService = {
    async getAll(): Promise<Tarea[]> {
      const { data, error } = await supabase.from('tareas').select('*');
      if (error) throw error;
      return data;
    },
  
    async getByEquipo(equipoId: number) {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('equipo_id', equipoId);
      if (error) throw error;
      return data as Tarea[];
    },
  
    async create(tarea: Omit<Tarea, 'id' | 'created_at'>): Promise<Tarea> {
      const { data, error } = await supabase.from('tareas').insert(tarea).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: number, tarea: Partial<Tarea>): Promise<Tarea> {
      const { data, error } = await supabase.from('tareas').update(tarea).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: number): Promise<void> {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (error) throw error;
    }
  };