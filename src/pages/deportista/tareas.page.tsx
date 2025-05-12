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
  IonIcon,
  IonToast
} from '@ionic/react';
import { time } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';

const DeportistaTareasPage: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const tareasData = await tareaService.getTareasDeportista();
      setTareas(tareasData);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setToastMessage('Error al cargar las tareas');
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
          <IonTitle>Mis Tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {tareas.map((tarea) => (
            <IonItem key={tarea.id}>
              <IonLabel>
                <h2>{tarea.titulo}</h2>
                <p>
                  <IonChip color={getEstadoColor(tarea.estado)}>
                    {getEstadoTexto(tarea.estado)}
                  </IonChip>
                </p>
                <p>{tarea.descripcion}</p>
                <p>
                  <IonIcon icon={time} /> {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                </p>
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

export default DeportistaTareasPage;
