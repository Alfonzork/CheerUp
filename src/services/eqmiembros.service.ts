import { supabase } from './supabase.service';
//import { EquipoMiembro } from '../types/iSupabase';

export const equipoMiembrosService = {
    async create(miembro: { equipo_id: string; deportista_id: string; fecha_ingreso: string; activo: boolean }) {
      // Primero verificamos si ya existe una relación activa
      const { data: existingMember } = await supabase
        .from('equipo_miembros')
        .select('*')
        .eq('deportista_id', miembro.deportista_id)
        .eq('activo', true)
        .single();
  
      if (existingMember) {
        // Si existe, la marcamos como inactiva
        await this.update(existingMember.id, { activo: false });
      }
  
      // Creamos la nueva relación
      const { data, error } = await supabase
        .from('equipo_miembros')
        .insert(miembro)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  
    async getByDeportista(deportistaId: string) {
      const { data, error } = await supabase
        .from('equipo_miembros')
        .select('*, equipos(*)')
        .eq('deportista_id', deportistaId)
        .eq('activo', true);
      if (error) throw error;
      return data;
    },
  
    async update(id: string, miembro: Partial<{ activo: boolean; fecha_ingreso: string }>) {
      const { data, error } = await supabase
        .from('equipo_miembros')
        .update(miembro)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  
    async delete(id: string) {
      const { error } = await supabase
        .from('equipo_miembros')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  }; 
