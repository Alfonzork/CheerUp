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
  IonToast,
  IonBadge,
  IonPopover
} from '@ionic/react';
import { time, person, checkbox } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import BackButton from '../../components/BackButton';
import { formatoFecha } from '../../utils/dateHelper';

interface DeportistaTarea {
  id: string;
  deportista: string;
  estado: number;
  fecha_asignacion: string;
  fecha_realizacion: string;
  deportista_id: string;
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

  const pendientes = deportistas.filter(t => t.estado === 1).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>{tarea ? tarea.titulo : ''} {" "}
            <span></span>
            <IonBadge id='badge-pendientes' color={'warning'}>
              {pendientes}
            </IonBadge> {" "}
            <IonPopover trigger='badge-pendientes' triggerAction='hover'>
                <IonContent class="ion-padding">¡Total Pendientes!</IonContent>
              </IonPopover>
            {tarea?.req_eva && (
              <>
              <IonBadge id='badge-evaluacion' color={'secondary'}>
                <IonIcon icon={checkbox} />
              </IonBadge> 
              <IonPopover trigger='badge-evaluacion' triggerAction='hover'>
                <IonContent class="ion-padding">¡Requiere evaluación!</IonContent>
              </IonPopover>
            </>           
            )}
            
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {tarea && (
          <div className="tarea-info">
            <p className="descripcion">{tarea.descripcion}</p>
            <div className="meta-info">
              {/* <IonChip color={tareaService.getEstadoColor(tarea.estado)}>
                {tareaService.getEstadoTexto(tarea.estado)}
              </IonChip> */}
              <p>
                <IonIcon icon={time} /> Fecha límite: {formatoFecha(tarea.fecha_vencimiento)}
              </p>
            </div>
          </div>
        )}

        <h3>Deportistas Asignados</h3>
        <IonList>
          {deportistas.map((deportista) => (
            <IonItem key={deportista.deportista_id}>
              <IonIcon icon={person} slot="start" />
              <IonLabel>
                <h2>{deportista.deportista}</h2>
                <p>
                <IonBadge color={tareaService.getEstadoColor(deportista.estado)}>
                  {tareaService.getEstadoTexto(deportista.estado)}
                </IonBadge>
                </p>
                <p>Asignado: <b>{new Date (deportista.fecha_asignacion).toLocaleDateString()}</b> 
                {deportista.fecha_realizacion && (
                  <>{' - '} Realizado: 
                  <b>{ new Date (deportista.fecha_realizacion).toLocaleDateString()}</b>
                  </>
                )}
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

export default TareaDetalle; 