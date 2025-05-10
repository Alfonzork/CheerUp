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
    IonDatetime,
    IonChip,
    IonBadge
  } from '@ionic/react';
  import { add, create, trash, checkmarkCircle, time, list } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import { equipoService } from '../../services/equipos.service';
  import { tareaService } from '../../services/tareas.service';
  import { subscribeToChanges } from '../../services/changes.service';
  import { Tarea, Equipo } from '../../models/supabase.model';
  import LoadingOverlay from '../../components/LoadingOverlay';
  import AccessibleModal from '../../components/AccessibleModal';
  import AccessibleAlert from '../../components/AccessibleAlert';
  import { AuthService } from '../../services/auth.service';
  
  const Tareas: React.FC = () => {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null);
    const [filtroEquipo, setFiltroEquipo] = useState<string>('');
    const [formData, setFormData] = useState({
      titulo: '',
      descripcion: '',
      fecha_vencimiento: '',
      estado: 'pendiente' as 'pendiente' | 'en_progreso' | 'completada',
      equipo_id: ''
    });
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [tareaToDelete, setTareaToDelete] = useState<string | null>(null);
  
    const cargarDatos = async () => {
      try {
        const [tareasData, equiposData] = await Promise.all([
          tareaService.getAll(),
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
  
      // Suscribirse a cambios en tiempo real
      const subscription = subscribeToChanges('tareas', (payload) => {
        console.log('Cambio detectado:', payload);
        cargarDatos(); // Recargar datos cuando hay cambios
      });
  
      // Limpiar suscripción al desmontar el componente
      return () => {
        subscription.unsubscribe();
      };
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const user = AuthService.getCurrentUser();
        const tareaData = {
          ...formData,
          equipo_id: formData.equipo_id,
          entrenador_id: user?.id || '',
          updated_at: new Date().toISOString(),
          fecha_vencimiento: formData.fecha_vencimiento
        };
  
        if (tareaEditar) {
          await tareaService.update(tareaEditar.id, tareaData);
          setToastMessage('Tarea actualizada correctamente');
        } else {
          await tareaService.create(tareaData);
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
        descripcion: tarea.descripcion,
        fecha_vencimiento: tarea.fecha_vencimiento,
        estado: tarea.estado as 'pendiente' | 'en_progreso' | 'completada',
        equipo_id: tarea.equipo_id.toString()
      });
      setShowModal(true);
    };
  
    const abrirModalCrear = () => {
      setTareaEditar(null);
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_vencimiento: '',
        estado: 'pendiente',
        equipo_id: ''
      });
      setShowModal(true);
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
  
    const getEquipoNombre = (equipoId: string) => {
      const equipo = equipos.find(e => e.id.toString() === equipoId);
      return equipo ? equipo.nombre : 'Sin equipo';
    };
  
    const tareasFiltradas = tareas.filter(tarea => 
      !filtroEquipo || tarea.equipo_id.toString() === filtroEquipo
    );
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tareas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSelect
            value={filtroEquipo}
            onIonChange={e => setFiltroEquipo(e.detail.value)}
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
              <IonItem key={tarea.id}>
                <IonLabel>
                  <p>
                    <IonChip color={getEstadoColor(tarea.estado)}>
                      {getEstadoTexto(tarea.estado)}
                    </IonChip>
                  </p>
                </IonLabel>
                <IonLabel>
                  <h2>{tarea.titulo}</h2>
                  <p>{tarea.descripcion}</p>
                  
                  <p>
                    <IonIcon icon={time} /> {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                  </p>
                  <p>Equipo: {getEquipoNombre(tarea.equipo_id.toString())}</p>
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton onClick={() => abrirModalEditar(tarea)}>
                    <IonIcon icon={create} />
                  </IonButton>
                  <IonButton onClick={() => handleDelete(tarea.id)}>
                    <IonIcon icon={trash} />
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
            onDidDismiss={() => setShowModal(false)}
            breakpoints={[0, 0.8]}
            initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>{tareaEditar ? 'Editar Tarea' : 'Nueva Tarea'}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmit}>
                <IonInput
                  label="Título"
                  labelPlacement="floating"
                  value={formData.titulo}
                  onIonChange={e => setFormData({...formData, titulo: e.detail.value!})}
                  required
                />
                <IonInput
                  label="Descripción"
                  labelPlacement="floating"
                  value={formData.descripcion}
                  onIonChange={e => setFormData({...formData, descripcion: e.detail.value!})}
                />
                <IonInput
                  type="date"
                  label="Fecha Límite"
                  labelPlacement="floating"
                  value={formData.fecha_vencimiento}
                  onIonChange={e => setFormData({...formData, fecha_vencimiento: e.detail.value!})}
                  required
                />
                <IonSelect
                  label="Estado"
                  labelPlacement="floating"
                  value={formData.estado}
                  onIonChange={e => setFormData({...formData, estado: e.detail.value as 'pendiente' | 'en_progreso' | 'completada'})}
                  required
                >
                  <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                  <IonSelectOption value="en_progreso">En Progreso</IonSelectOption>
                  <IonSelectOption value="completada">Completada</IonSelectOption>
                </IonSelect>
                <IonSelect
                  label="Equipo"
                  labelPlacement="floating"
                  value={formData.equipo_id}
                  onIonChange={e => setFormData({...formData, equipo_id: e.detail.value})}
                  required
                >
                  {equipos.map(equipo => (
                    <IonSelectOption key={equipo.id} value={equipo.id.toString()}>
                      {equipo.nombre}
                    </IonSelectOption>
                  ))}
                </IonSelect>
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
  
  export default Tareas; 