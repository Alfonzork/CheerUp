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
import { calendar, checkmarkCircle, closeCircle, time, alertCircle } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { asistenciaService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';

const DeportistaAsistenciaPage: React.FC = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const cargarAsistencias = async () => {
    try {
      setLoading(true);
      const asistenciasData = await asistenciaService.getAsistenciasDeportista();
      setAsistencias(asistenciasData);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      setToastMessage('Error al cargar las asistencias');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'presente':
        return 'success';
      case 'ausente':
        return 'danger';
      case 'justificado':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'presente':
        return checkmarkCircle;
      case 'ausente':
        return closeCircle;
      case 'justificado':
        return time;
      default:
        return alertCircle;
    }
  };

  const getEstadoTexto = (estado: string): string => {
    switch (estado) {
      case 'presente':
        return 'Presente';
      case 'ausente':
        return 'Ausente';
      case 'justificado':
        return 'Justificado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {asistencias.map((asistencia, index) => (
            <IonItem key={asistencia.id || `asistencia-${index}`}>
              <IonLabel>
                <h2>{asistencia.nombre}</h2>
                <IonChip color={getEstadoColor(asistencia.estado)}>
                  <IonIcon icon={getEstadoIcono(asistencia.estado)} />
                  <IonLabel>{getEstadoTexto(asistencia.estado)}</IonLabel>
                </IonChip>
              </IonLabel>
              <IonLabel>
                <h2>{new Date(asistencia.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</h2>
                <p>{asistencia.observacion ? asistencia.observacion : 'Sin Observacion'}</p>

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

export default DeportistaAsistenciaPage;
