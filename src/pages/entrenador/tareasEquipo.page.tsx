import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonToast,
  IonBadge,
  IonTextarea,
  IonCheckbox
} from '@ionic/react';
import { add, create, trash, time } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { tareaService } from '../../services/tareas.service';
import { equipoService } from '../../services/equipos.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import AccessibleAlert from '../../components/AccessibleAlert';
import { AuthService } from '../../services/auth.service';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import { formatoFecha } from '../../utils/dateHelper';
import tareaHelper from '../../utils/tareaHelper';
import BackButton from '../../components/BackButton';

const TareasEquipo: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_vencimiento: '',
    estado: 1,
    equipo_id: '',
    req_eva: false
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tareaToDelete, setTareaToDelete] = useState<string | null>(null);
  const history = useHistory();

  const cargarDatos = async () => {
    try {
      const [tareasData, equiposData] = await Promise.all([
        tareaService.getAllEquipo(),
        equipoService.getAll()
      ]);
      setTareas(tareasData);
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToastMessage('Error al cargar los datos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = AuthService.getCurrentUser();
      if (tareaEditar) {
        await tareaService.update(tareaEditar.id, {
          ...formData,
          entrenador_id: user?.id
        });
        setToastMessage('Tarea actualizada correctamente');
      } else {
        await tareaService.crear_tarea(
          formData.titulo.trim(),
          formData.descripcion.trim(),
          formData.equipo_id,
          user?.id || '',
          formData.fecha_vencimiento,
          formData.estado,
          formData.req_eva
        );
        setToastMessage('Tarea creada correctamente');
      }
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      setToastMessage('Error al guardar la tarea');
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  const handleDelete = async (id: string) => {
    setTareaToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!tareaToDelete) return;

    setLoading(true);
    try {
      await tareaService.delete(tareaToDelete);
      setToastMessage('Tarea eliminada correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      setToastMessage('Error al eliminar la tarea');
    } finally {
      setLoading(false);
      setTareaToDelete(null);
    }
  };

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditar(tarea);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      fecha_vencimiento: tarea.fecha_vencimiento,
      estado: tarea.estado,
      equipo_id: tarea.equipo_id?.toString() || '',
      req_eva: tarea.req_eva || false
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setTareaEditar(null);
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_vencimiento: '',
      estado: 1,
      equipo_id: '',
      req_eva: false
    });
    setShowModal(true);
  };

  const getEquipoNombre = (equipoId: string) => {
    const equipo = equipos.find(e => e.id.toString() === equipoId);
    return equipo ? equipo.nombre : 'Sin equipo';
  };

  const tareasFiltradas = tareas.filter(tarea =>
    !selectedEquipoId || tarea.equipo_id?.toString() === selectedEquipoId
  );

  const handleTareaClick = (tareaId: string) => {
    history.push(`/entrenador/tareas/${tareaId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>
            Tareas de Equipo
          </IonTitle>
        </IonToolbar>
      </IonHeader>     
      <IonContent className="ion-padding"> 
        
        <IonSelect
          value={selectedEquipoId}
          onIonChange={e => setSelectedEquipoId(e.detail.value)}
          placeholder="Filtrar por equipo"
          className="ion-margin-bottom"
          style={{
            '--background': '#2c2c2c',
            '--color': '#ffffff',
            '--placeholder-color': '#999999',
            '--padding-start': '16px',
            '--padding-end': '16px',
            '--padding-top': '8px',
            '--padding-bottom': '8px',
            '--border-radius': '8px'
          }}
        >
          <IonSelectOption value="">Todos los equipos</IonSelectOption>
          {equipos.map(equipo => (
            <IonSelectOption key={equipo.id} value={equipo.id.toString()}>
              {equipo.nombre}
            </IonSelectOption>
          ))}
        </IonSelect>

        <IonList>
          {tareasFiltradas.map((tarea) => (
            <IonItem key={tarea.id} button onClick={() => handleTareaClick(tarea.id)}>
              <IonLabel>
                <h2>{tarea.titulo}</h2>
                <p>
                  <IonBadge color={tareaHelper.getEstadoColor(tarea.estado)}>
                    {tareaHelper.getEstadoTexto(tarea.estado)}
                  </IonBadge>
                </p>
                { tarea.req_eva && (
                  <p>
                    <IonBadge color="secondary">
                      Evaluación
                    </IonBadge>
                  </p>
                )}
              </IonLabel>
              <IonLabel>
                <p>{tarea.descripcion}</p>
                <p>
                  <IonIcon icon={time} /> {formatoFecha(tarea.fecha_vencimiento)}
                </p>
                <p><b>{getEquipoNombre(tarea.equipo_id)}</b></p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton onClick={(e) => {
                  e.stopPropagation();
                  abrirModalEditar(tarea);
                }}>
                  <IonIcon icon={create} color='primary' />
                </IonButton>
                <IonButton onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(tarea.id);
                }}>
                  <IonIcon icon={trash} color='danger' />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={abrirModalCrear} color="warning">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <AccessibleModal
          isOpen={showModal}
          onDidDismiss={() => {
            setShowModal(false);
            setSelectedEquipoId(null);
          }}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          aria-modal="true"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{tareaEditar ? 'Editar Tarea de Equipo' : 'Nueva Tarea de Equipo'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => {
                  setShowModal(false);
                  setSelectedEquipoId(null);
                }}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={handleSubmit}>
              <IonInput
                label="Título"
                labelPlacement="floating"
                value={formData.titulo}
                onIonChange={e => setFormData({ ...formData, titulo: e.detail.value! })}
                required
              />
              <IonTextarea
                label="Descripción"
                labelPlacement="floating"
                value={formData.descripcion}
                onIonChange={e => setFormData({ ...formData, descripcion: e.detail.value! })}
                rows={3}
                autoGrow={true}
                required
              />
              <IonInput
                type="date"
                label="Fecha Límite"
                labelPlacement="floating"
                value={formData.fecha_vencimiento}
                onIonChange={e => setFormData({ ...formData, fecha_vencimiento: e.detail.value! })}
                required
              />
              <IonSelect
                label="Estado"
                labelPlacement="floating"
                value={formData.estado}
                onIonChange={e => setFormData({ ...formData, estado: e.detail.value })}
                required
                interface="action-sheet"
                className="custom-select"
              >
                <IonSelectOption value="1">Pendiente</IonSelectOption>
                <IonSelectOption value="2">En Progreso</IonSelectOption>
                <IonSelectOption value="3">Completada</IonSelectOption>
              </IonSelect>

              <IonSelect
                label="Equipo"
                labelPlacement="floating"
                value={formData.equipo_id}
                onIonChange={e => setFormData({ ...formData, equipo_id: e.detail.value })}
                required
                interface="action-sheet"
                className="custom-select"
              >
                {equipos.map(equipo => (
                  <IonSelectOption key={equipo.id} value={equipo.id.toString()}>
                    {equipo.nombre}
                  </IonSelectOption>
                ))}
              </IonSelect>

              <IonCheckbox
                checked={formData.req_eva}
                onIonChange={e => setFormData({ ...formData, req_eva: e.detail.checked })}
                justify='space-between'
                className="custom-select"
              >Evaluar Tarea
              </IonCheckbox>

              <IonButton expand="block" type="submit" className="ion-margin-top">
                {tareaEditar ? 'Actualizar' : 'Crear'}
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
        />

        <AccessibleAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => {
            setShowDeleteAlert(false);
            setTareaToDelete(null);
          }}
          header="Confirmar eliminación"
          message="¿Está seguro que desea eliminar esta tarea? Esta acción no se puede deshacer."
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

export default TareasEquipo; 