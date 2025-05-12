import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonButton,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonToast
} from '@ionic/react';
import { time, person } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';

interface DeportistaTarea {
  id: string;
  deportista: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fecha_asignacion: string;
}

const TareaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [deportistas, setDeportistas] = useState<DeportistaTarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [tareaData, deportistasData] = await Promise.all([
        tareaService.getById(id),
        tareaService.getDeportistasByTarea(id)
      ]);
      setTarea(tareaData);
      setDeportistas(deportistasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToastMessage('Error al cargar los datos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'en_progreso':
        return 'primary';
      case 'completada':
        return 'success';
      default:
        return 'medium';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      default:
        return estado;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/entrenador/tareas" />
          </IonButtons>
          <IonTitle>Detalle de Tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {tarea && (
          <div className="tarea-info">
            <h3>{tarea.titulo}</h3>
            <p className="descripcion">{tarea.descripcion}</p>
            <div className="meta-info">
              <IonChip color={getEstadoColor(tarea.estado)}>
                {getEstadoTexto(tarea.estado)}
              </IonChip>
              <p>
                <IonIcon icon={time} /> Fecha límite: {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <h3>Deportistas Asignados</h3>
        <IonList>
          {deportistas.map((deportista) => (
            <IonItem key={deportista.id}>
              <IonIcon icon={person} slot="start" />
              <IonLabel>
                <h2>{deportista.deportista}</h2>
                <p>
                  <IonChip color={getEstadoColor(deportista.estado)}>
                    {getEstadoTexto(deportista.estado)}
                  </IonChip>
                </p>
                <p>Asignado: {new Date(deportista.fecha_asignacion).toLocaleDateString()}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default TareaDetalle; 