import { supabase } from './supabase.service';
import { Tarea } from '../models/supabase.model';
import { AuthService } from './auth.service';
import { checkmarkCircleOutline, timeOutline } from 'ionicons/icons';

export const tareaService = {
    async getAll(): Promise<Tarea[]> {
      const { data, error } = await supabase.from('tareas').select('*').order('fecha_vencimiento', { ascending: false });
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

    async crear_tarea(titulo: string,descripcion: string, equipo_id: string, entrenador_id: string, fecha_vencimiento: string, estado: number, req_eva: boolean): Promise<void> {
      const { error } = await supabase.rpc('crear_tarea',{
        tit: titulo,
        decrip: descripcion,
        equ_id: equipo_id,
        ent_id: entrenador_id,
        fecha_v: fecha_vencimiento,
        est: estado,
        req_e: req_eva
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
      const { data, error } = await supabase.from('view_tarea_deportistas').select('*').eq('tarea_id', tareaId).order('estado', {ascending: true}).order('deportista', {ascending: true} );
      if (error) throw error;
      return data;
    },

    async getTareasDeportista(): Promise<Tarea[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase.from('view_tarea_deportistas').select('*').eq('deportista_id', user.id);

      if (error) throw error;

      return data;
    },

    async getTareasPendientesDeportista(): Promise<Tarea[]> {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('view_tarea_deportistas')
        .select('*')
        .eq('deportista_id', user.id)
        .eq('estado', 1);

      if (error) throw error;

      return data;
    },

    async marcarTareaCompletada(id: number): Promise<void> {
      try {
        const { error } = await supabase
          .from('tarea_deportista')
          .update({ estado: 3, updated_at: new Date().toISOString()})
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error al marcar tarea como completada:', error);
        throw error;
      }
    },

  getEstadoColor(estado: number) {
    switch (estado) {
      case 1:
        return 'warning';
      case 2:
        return 'primary';
      case 3:
        return 'success';
      case 4:
        return 'success';  
      default:
        return 'medium';
    }
  },

  getEstadoTexto(estado: number) {
    switch (estado) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'En Progreso';
      case 3:
        return 'Completado';
      case 4:
        return 'Evaluado';
      default:
        return estado;
    }
  },

    getEstadoIcono(estado: number) {
    switch (estado) {
      case 1:
        return timeOutline;
      case 3:
        return checkmarkCircleOutline;
      case 4:
        return checkmarkCircleOutline;
      default:
        return timeOutline;
    }
  },

  guardarEvaluacion: async (id: number, nota: number, observacion: string, entrenador_id: string) => {
    const { error } = await supabase.from('tarea_deportista').update({ nota: nota, observacion: observacion, entrenador_id: entrenador_id, estado:4 }).eq('id', id);

    if (error) throw error;
  }
};