import { supabase } from './supabase.service';
import { Evento } from '../models/supabase.model';    
// Servicios para Eventos
export const eventoService = {
    async getAll(): Promise<Evento[]> {
      const { data, error } = await supabase.from('eventos').select('*');
      if (error) throw error;
      return data;
    },
  
    async getByEquipo(equipoId: number) {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('equipo_id', equipoId);
      if (error) throw error;
      return data as Evento[];
    },
  
    async create(evento: Omit<Evento, 'id' | 'created_at'>): Promise<Evento> {
      const { data, error } = await supabase.from('eventos').insert(evento).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: number, evento: Partial<Evento>): Promise<Evento> {
      const { data, error } = await supabase.from('eventos').update(evento).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: number): Promise<void> {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) throw error;
    }
  };