import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToast,
  IonBadge,
  IonPopover,
  IonRange,
  IonTextarea,
} from '@ionic/react';
import { time, person, checkbox, car, trash } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { tareaService } from '../../services/tareas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import BackButton from '../../components/BackButton';
import { formatoFecha, formatoFechaHora } from '../../utils/dateHelper';
import AccessibleModal from '../../components/AccessibleModal';
import './range.css';
import { AuthService } from '../../services/auth.service';
import tareaHelper from '../../utils/tareaHelper';
import AccessibleAlert from '../../components/AccessibleAlert';


interface DeportistaTarea {
  id: string;
  deportista: string;
  estado: number;
  fecha_asignacion: string;
  fecha_realizacion: string;
  deportista_id: string;
  idx: number;
}

const TareaDetIndividual: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [deportistas, setDeportistas] = useState<DeportistaTarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'warning' | 'danger' | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const user = AuthService.getCurrentUser();
  const [evaluacion, setEvaluacion] = useState({
    id: 0,
    nota: 0,
    observacion: '',
    entrenador_id: user?.id || '',
  })
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deportistaTareaToDelete, setDeportistaTareaToDelete] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Aquí puedes manejar la lógica de evaluación
    setShowModal(false);
    try {
      if (evaluacion) {
        await tareaService.guardarEvaluacion(evaluacion.id, evaluacion.nota, evaluacion.observacion, evaluacion.entrenador_id);
        setToastMessage('Evaluación guardada con éxito');
        setShowToast(true);
        setToastColor('success');
        cargarDatos(); // Recargar los datos después de guardar la evaluación
      }    
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      setToastMessage('Error al guardar la evaluación');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async (id: number) => {
    setDeportistaTareaToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!deportistaTareaToDelete) return;

    setLoading(true);
    try {
      await tareaService.deleteDeportistaTarea(deportistaTareaToDelete);
      setToastMessage('Tarea eliminada correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      setToastMessage('Error al eliminar la tarea');
    } finally {
      setLoading(false);
      setDeportistaTareaToDelete(null);
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
          {deportistas.map((deportista) => {
            return (
              <IonItem
                key={deportista.idx}
                button={tarea?.req_eva} // Esto hace que el item sea clickeable solo si la condición es true
                onClick={tarea?.req_eva ? () => {
                  setEvaluacion({
                    ...evaluacion,
                    id: deportista.idx, // Asigna el id aquí
                    nota: 0
                  });
                  setShowModal(true);
                } : undefined}
              >
                <IonIcon icon={person} slot="start" />
                <IonLabel>
                  <h2>{deportista.deportista}</h2>
                  <p>
                    <IonBadge color={tareaHelper.getEstadoColor(deportista.estado)}>
                      {tareaHelper.getEstadoTexto(deportista.estado)}
                    </IonBadge>
                  </p>
                  <p>Asignado: <b>{formatoFechaHora(deportista.fecha_asignacion)}</b></p>
                    {deportista.fecha_realizacion && (
                      <><p>Realizado:
                        <b>{formatoFechaHora(deportista.fecha_realizacion)} </b></p>
                      </>
                    )}                  
                </IonLabel>
                {deportista.estado === 1 && (
                <IonButtons slot="end">
                  <IonButton onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(deportista.idx);
                  }}>
                    <IonIcon icon={trash} color='danger' />
                  </IonButton>
                </IonButtons>
                )}
              </IonItem>
            );
          })}
        </IonList>

        <AccessibleModal 
          isOpen={showModal} 
          onDidDismiss={() => setShowModal(false)}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Evaluar</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmit}>                
                <IonRange
                  label='Evaluar'
                  labelPlacement='start'
                  aria-label="Range with ticks"
                  ticks={true}
                  snaps={true}
                  min={0}
                  max={5}
                  pin={true}
                  onIonChange={e => {
                    const value = e.detail.value;
                    setEvaluacion({
                      ...evaluacion,
                      nota: typeof value === 'number' ? value : (typeof value === 'object' && value !== null && 'lower' in value ? value.lower : 0)
                    });
                  }}
                ></IonRange>
                <IonTextarea
                  label="Observación"
                  labelPlacement="floating"
                  value={evaluacion.observacion}
                  onIonChange={e => setEvaluacion({...evaluacion, observacion: e.detail.value!})}
                  rows={4}
                />
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  Guardar
                </IonButton>
                </form>
            </IonContent>

        </AccessibleModal>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
         <AccessibleAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => {
            setShowDeleteAlert(false);
            setDeportistaTareaToDelete(null);
          }}
          header="Confirmar eliminación"
          message="¿Está seguro que desea eliminar a Deportista? Esta acción no se puede deshacer."
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Eliminar',
              handler: confirmDelete
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default TareaDetIndividual;