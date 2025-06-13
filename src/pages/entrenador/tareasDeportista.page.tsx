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
  IonCheckbox,
  IonNote
} from '@ionic/react';
import { add, create, trash, time } from 'ionicons/icons';
import React, { useEffect, useState, useRef } from 'react';
import { tareaService } from '../../services/tareas.service';
import { deportistaService } from '../../services/deportistas.service';
import { Tarea } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import AccessibleAlert from '../../components/AccessibleAlert';
import { AuthService } from '../../services/auth.service';
import { useHistory } from 'react-router-dom';
import { formatoFecha } from '../../utils/dateHelper';
import tareaHelper from '../../utils/tareaHelper';
import BackButton from '../../components/BackButton';
import AppTypeahead from '../../components/AppTypehead';

const TareasDeportista: React.FC = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null);
  const [selectedDeportistaId, setSelectedDeportistaId] = useState<string | null>(null);
  const [selectedDeportistas, setSelectedDeportistas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_vencimiento: '',
    estado: 1,
    deportista_id: '',
    req_eva: false
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tareaToDelete, setTareaToDelete] = useState<string | null>(null);
  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  const cargarDatos = async () => {
    try {
      const [tareasData, deportistasData] = await Promise.all([
        tareaService.getAllIndividual(),
        deportistaService.getAll()
      ]);
      setTareas(tareasData);
      setDeportistas(deportistasData);
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

  const handleCrearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = AuthService.getCurrentUser();

      // Preparar datos para la tarea
      const tareaData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fecha_vencimiento: formData.fecha_vencimiento,
        estado: formData.estado,
        req_eva: formData.req_eva,
        entrenador_id: user?.id
      };

      if (tareaEditar) {
        await tareaService.update(tareaEditar.id, {
                  ...tareaData,
                  entrenador_id: user?.id
                });
                setToastMessage('Tarea actualizada correctamente');
      } else {
        const deportistaIds = selectedDeportistas.map(d => d.id.toString());
        await tareaService.crear_tarea_individual_multiple(
          tareaData.titulo,
          tareaData.descripcion,
          deportistaIds,
          tareaData.entrenador_id || '',
          tareaData.fecha_vencimiento,
          tareaData.estado,
          tareaData.req_eva
        );
      }
      await cargarDatos();
      
      setToastMessage('Tarea(s) creada(s) correctamente');
      setShowToast(true);
      
      // Limpiar el formulario
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_vencimiento: '',
        estado: 1,
        deportista_id: '',
        req_eva: false
      });
      setSelectedDeportistas([]);
      
      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
      
    } catch (error) {      
      setToastMessage(`Error: ${error}`);
      setShowToast(true);
    } finally {
      setLoading(false);
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

  const deportistaSelectionChanged = (deportistas: any[]) => {
    setSelectedDeportistas(deportistas);
    if (deportistas.length > 0) {
      setFormData(prev => ({
        ...prev,
        deportista_id: deportistas[0].id.toString()
      }));
      setSelectedDeportistaId(deportistas[0].id.toString());
    } else {
      setFormData(prev => ({
        ...prev,
        deportista_id: ''
      }));
      setSelectedDeportistaId(null);
    }
    modal.current?.dismiss();
  };

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditar(tarea);
    const deportistaSeleccionado = deportistas.find(d => d.id.toString() === tarea.deportista_id?.toString());
    setSelectedDeportistas(deportistaSeleccionado ? [deportistaSeleccionado] : []);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      fecha_vencimiento: tarea.fecha_vencimiento,
      estado: tarea.estado,
      deportista_id: tarea.deportista_id?.toString() || '',
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
      deportista_id: '',
      req_eva: false
    });
    setSelectedDeportistas([]);
    setSelectedDeportistaId(null);
    setShowModal(true);
  };

  const getDeportistaNombre = (deportistaId: string) => {
    const deportista = deportistas.find(d => d.id.toString() === deportistaId);
    return deportista ? `${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}` : 'Sin deportista';
  };

  const tareasFiltradas = tareas.filter(tarea =>
    !selectedDeportistaId || tarea.deportista_id?.toString() === selectedDeportistaId
  );

  const handleTareaClick = (tareaId: string) => {
    history.push(`/entrenador/tareas-individual/${tareaId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>
            Tareas de Deportista
          </IonTitle>
        </IonToolbar>
      </IonHeader>   
      <IonContent className="ion-padding">        
        <IonSelect
          value={selectedDeportistaId}
          onIonChange={e => setSelectedDeportistaId(e.detail.value)}
          placeholder="Filtrar por deportista"
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
          <IonSelectOption value="">Todos los deportistas</IonSelectOption>
          {deportistas.map(deportista => (
            <IonSelectOption key={deportista.id} value={deportista.id.toString()}>
              {`${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}`}
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
              </IonLabel>
              <IonLabel>
                <p>{tarea.descripcion}</p>
                <p>
                  <IonIcon icon={time} /> {formatoFecha(tarea.fecha_vencimiento)}
                </p>
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
            setSelectedDeportistaId(null);
          }}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          aria-modal="true"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{tareaEditar ? 'Editar Tarea Individual' : 'Nueva Tarea Individual'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => {
                  setShowModal(false);
                  setSelectedDeportistaId(null);
                }}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={handleCrearTarea}>
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

              <IonItem button={true} detail={false} id='select-deportista-modal' lines='full'>
                <IonLabel>Deportistas</IonLabel>
                <IonNote slot="end">
                  {selectedDeportistas.length > 0 
                    ? `${selectedDeportistas.length} seleccionados` 
                    : 'Seleccionar deportistas'}
                </IonNote>
              </IonItem>
              
              <IonModal trigger="select-deportista-modal" ref={modal}>
                <AppTypeahead
                  title="Deportistas"
                  items={deportistas.map(d => ({
                    id: d.id,
                    text: `${d.nombres} ${d.ap_paterno} ${d.ap_materno}`
                  }))}
                  selectedItems={selectedDeportistas.map(d => ({
                    id: d.id,
                    text: `${d.nombres} ${d.ap_paterno} ${d.ap_materno}`
                  }))}
                  onSelectionCancel={() => modal.current?.dismiss()}
                  onSelectionChange={deportistaSelectionChanged}
                />
              </IonModal>

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

export default TareasDeportista; 