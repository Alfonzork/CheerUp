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
  IonToast,
  IonBadge,
  IonButton,
  IonNote
} from '@ionic/react';
import { time, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AppHeader from '../../components/AppHeader';

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

  const handleMarcarCompletada = async (id: number) => {
    try {
      setLoading(true);
      await tareaService.marcarTareaCompletada(id);
      setToastMessage('Tarea marcada como completada');
      setShowToast(true);
      // Recargar las tareas después de marcar como completada
      await cargarTareas();
    } catch (error) {
      console.error('Error al marcar tarea como completada:', error);
      setToastMessage('Error al marcar la tarea como completada');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: number) => {
    switch (estado) {
      case 1:
        return 'warning';
      case 3:
        return 'success';
      default:
        return 'medium';
    }
  };

  const getEstadoTexto = (estado: number) => {
    switch (estado) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'En Progreso';
      case 3:
        return 'Completada';
      default:
        return estado;
    }
  };

  const getEstadoIcono = (estado: number) => {
    switch (estado) {
      case 1:
        return timeOutline;
      case 3:
        return checkmarkCircleOutline;
      default:
        return timeOutline;
    }
  };

  return (
    <IonPage>
      <AppHeader title="Mis Tareas" />
      <IonContent className="ion-padding">
        <IonList>
          {tareas.map((tarea) => (
            <IonItem key={tarea.idx}>
              <IonLabel>
                <h2>{tarea.titulo}</h2>
                <p>{tarea.descripcion}</p>
                <p>
                  <IonChip color={getEstadoColor(tarea.estado)}>
                    {getEstadoTexto(tarea.estado)}
                  </IonChip>
                </p>
                <p>
                  <IonIcon icon={time} /> Asignado: {new Date(tarea.fecha_asignacion).toLocaleDateString()}
                </p>
                <p>
                  <IonIcon icon={time} /> Vencimiento: {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                </p>
              </IonLabel>
              {tarea.estado_nombre.toLowerCase() === 'pendiente' && (
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => handleMarcarCompletada(tarea.idx)}
                >
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '24px' }} />
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default DeportistaTareasPage;
