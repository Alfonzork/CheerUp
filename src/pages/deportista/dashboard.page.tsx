import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon
} from '@ionic/react';
import { time, checkmarkCircle, alertCircle } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AppHeader from '../../components/AppHeader';
import tareaHelper from '../../utils/tareaHelper';

const DeportistaDashboardPage: React.FC = () => {
  const [tareasPendientes, setTareasPendientes] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTareasPendientes();
  }, []);

  const cargarTareasPendientes = async () => {
    try {
      setLoading(true);
      const tareas = await tareaService.getTareasPendientesDeportista();
      setTareasPendientes(tareas);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <AppHeader title="Dashboard" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tareas Pendientes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {tareasPendientes.map((tarea) => (
                <IonItem key={tarea.id}>
                  <IonLabel>
                    <h2>{tarea.titulo}</h2>
                    <p>{tarea.descripcion}</p>
                    <p>
                      <IonIcon icon={time} /> {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                    </p>
                    <IonChip color={tareaHelper.getEstadoColor(tarea.estado)}>
                      {tareaHelper.getEstadoTexto(tarea.estado)}
                    </IonChip>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
      </IonContent>
    </IonPage>
  );
};

export default DeportistaDashboardPage;
