import { supabase } from './supabase.service';
import { Tarea } from '../models/supabase.model';
import { AuthService } from './auth.service';

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
      //console.log('Datos recibidos para actualizar:', tarea);
      
      const updateData = {
        ...tarea,
        updated_at: new Date().toISOString()
      };
      
      //console.log('Datos a enviar a Supabase:', updateData);
      
      const { data, error } = await supabase
        .from('tareas')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error al actualizar tarea:', error);
        throw error;
      }
      
      //console.log('Respuesta de Supabase:', data);
      return data;
    },
  
    async delete(id: string): Promise<void> {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (error) throw error;
    },

    async crear_tarea(titulo: string,descripcion: string, equipo_id: string, entrenador_id: string, fecha_vencimiento: string, estado: string): Promise<void> {
      const { error } = await supabase.rpc('crear_tarea',{
        tit: titulo,
        decrip: descripcion,
        equ_id: equipo_id,
        ent_id: entrenador_id,
        fecha_v: fecha_vencimiento,
        est: estado
      });
      if (error) throw error;
    },

    async getById(id: string): Promise<Tarea> {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async getDeportistasByTarea(tareaId: string) {
      const { data, error } = await supabase.from('view_tarea_deportistas').select('*').eq('tarea_id', tareaId);
      if (error) throw error;
      return data;
    },

    async getTareasDeportista(): Promise<Tarea[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('tareas_deportistas')
        .select('*')
        .eq('deportista_id', user.id);

      if (error) throw error;

      return data.map(item => item.tareas);
    },

    async getTareasPendientesDeportista(): Promise<Tarea[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('tareas_deportistas')
        .select('*')
        .eq('deportista_id', user.id)
        .eq('estado', 'pendiente');

      if (error) throw error;

      return data;
    }
};