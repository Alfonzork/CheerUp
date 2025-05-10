import { supabase } from './supabase.service';
import { Tarea } from '../models/supabase.model';

export const tareaService = {
    async getAll(): Promise<Tarea[]> {
      const { data, error } = await supabase.from('tareas').select('*');
      if (error) throw error;
      return data;
    },
  
    async getByEquipo(equipoId: string) {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('equipo_id', equipoId);
      if (error) throw error;
      return data as Tarea[];
    },
  
    async create(tarea: Omit<Tarea, 'id' | 'created_at'> & { entrenador_id: string }): Promise<Tarea> {
      const { data, error } = await supabase.from('tareas').insert(tarea).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: string, tarea: Partial<Tarea> & { entrenador_id?: string }): Promise<Tarea> {
      const { data, error } = await supabase.from('tareas').update(tarea).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (error) throw error;
    }
  };