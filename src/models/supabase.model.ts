export type Deportista = {
    id: number;
    run: string;
    nombres: string;
    ap_paterno: string;
    ap_materno: string;
    deportista: string;
    nombre_equipos: string;
    fecha_nacimiento: string;
    equipo_id: number;
    created_at: string;
  };
  
  export interface Equipo {
    id: number;
    nombre: string;
    descripcion: string;
    entrenador_id: number;
    image: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Tarea {
    id: number;
    equipo_id: number;
    entrenador_id: number;
    titulo: string;
    descripcion: string;
    fecha_limite: string;
    fecha_vencimiento: string;
    estado: 'pendiente' | 'en_progreso' | 'completada';
    updated_at: string;
    created_at: string;
  }
  
  export interface Asistencia {
    id: number;
    deportista_id: string;
    equipo_id: string;
    entrenador_id: string;
    fecha: string;
    estado: 'presente' | 'ausente' | 'justificado';
    observaciones: string;
    created_at: string;
    nombre: string;
    entrenador: string;
  }
  
  export interface Evaluacion {
    id: number;
    deportista_id: number;
    puntuacion: number;
    fecha: string;
    tipo: 'fisica' | 'tecnica' | 'tactica';
    observaciones: string;
    notas: string;
    created_at: string;
  }
  
  export interface Evento {
    id: number;
    titulo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    tipo: 'entrenamiento' | 'presentacion' | 'evento';
    ubicacion: string;
    created_at: string;
  } 