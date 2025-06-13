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
    equipo_id: string;
  }
  
  export interface Tarea {
    id: string;
    tarea_id: string;
    deportista: string;
    equipo_id: string;
    entrenador_id: string;
    titulo: string;
    descripcion: string;
    fecha_vencimiento: string;
    estado: number;
    updated_at: string;
    created_at: string;
    fecha_asignacion: string;
    fecha_realizacion: string;
    fecha_evaluacion: string;
    deportista_id: string;
    estado_nombre: string;
    idx: number;
    req_eva: boolean
  }
  
  export interface Asistencia {
    id: string;
    fecha: string;
    descripcion: string;
    estado: 'presente' | 'ausente' | 'justificado';
    observacion?: string;
    deportista_id: string;
    deportista: string;
    aglobal_id: string;
    nombre: string;
    equipo_id: string;
    entrenador_id: string;
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

  export interface Nivel {
      id: number;
      name: string;
      description: string;
      exercises: Exercises[]; // Agregado para evitar el error
  }
  
  export interface Exercises {
      id: string;
      name: string;
      description: string;
      difficulty_id: number;
      exercise_media: Exercise_media[]; // Agregado para evitar el error
  }
  
  export interface Exercise_media {
      id: string;
      url: string;
      media_type: string;
      position: number;
      exercise_id: string;
  }