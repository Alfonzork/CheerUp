import { supabase } from './supabase.service';
import { Asistencia } from '../models/supabase.model';

// Servicios para Asistencias
export const asistenciaService = {
    async getAll(): Promise<Asistencia[]> {
      const { data, error } = await supabase.from('asistencias').select('*');
      if (error) throw error;
      return data;
    },
  
    async create(asistencia: Omit<Asistencia, 'id' | 'created_at'>): Promise<Asistencia> {
      const { data, error } = await supabase.from('asistencias').insert(asistencia).select().single();
      if (error) throw error;
      return data;
    },
  
    async update(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia> {
      const { data, error } = await supabase.from('asistencias').update(asistencia).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: number): Promise<void> {
      const { error } = await supabase.from('asistencias').delete().eq('id', id);
      if (error) throw error;
    },

    async registrarAsistencia(entrenador_id: string, equipo_id: string, fecha: string): Promise<void> {
      const { error } = await supabase.rpc('crear_asistencia',{
        ent_id: entrenador_id,
        equ_id: equipo_id,
        fecha_a: fecha
      });
      if (error) throw error;
    },

    async listarAsistencias(): Promise<Asistencia[]> {
      const { data, error } = await supabase.from('asistencia_listar').select('*');
      if (error) throw error;
      return data;
    },

    async listarAsistDeportistas(asistencia_id: string): Promise<Asistencia[]> {
      const { data, error } = await supabase.from('asis_deportistas').select('*').eq('aglobal_id', asistencia_id);
      if (error) throw error;
      return data;
    },

    async updAsistenciaDep(id: number, estado: string, observacion: string): Promise<void> {
      const { error } = await supabase.from('asistencias').update({ estado: estado, observacion: observacion }).eq('id', id).select().single();
      if (error) throw error;
    }
  };