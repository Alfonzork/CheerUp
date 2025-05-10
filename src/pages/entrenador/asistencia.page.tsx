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
    IonSearchbar
  } from '@ionic/react';
  import { add, create, trash, person, checkmarkCircle, closeCircle } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import { asistenciaService } from '../../services/asistencia.service';
  import { deportistaService } from '../../services/deportistas.service';
  import { subscribeToChanges } from '../../services/changes.service';
  import { Asistencia, Deportista, Equipo } from '../../models/supabase.model';
  import { equipoService } from '../../services/equipos.service';
  import { AuthService } from '../../services/auth.service';
  import { useHistory } from 'react-router-dom';
  import LoadingOverlay from '../../components/LoadingOverlay';
  import AccessibleModal from '../../components/AccessibleModal';
  
  const Asistencias: React.FC = () => {
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [deportistas, setDeportistas] = useState<Deportista[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [asistenciaEditar, setAsistenciaEditar] = useState<Asistencia | null>(null);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
      fecha: '',
      equipo_id: '',
      deportista_id: '',
      entrenador_id: '',
      estado: 'presente' as 'presente' | 'ausente' | 'justificado',
      observaciones: '',
      nombre: '',
      entrenador: ''
    });
    const history = useHistory();
  
    const cargarDatos = async () => {
      try {
        const [asistenciasData, deportistasData, equiposData] = await Promise.all([
          asistenciaService.listarAsistencias(),
          deportistaService.getAll(),
          equipoService.getAll()
        ]);
        setAsistencias(asistenciasData);
        setDeportistas(deportistasData);
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
      const subscription = subscribeToChanges('asistencias', (payload) => {
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
          await asistenciaService.registrarAsistencia(formData.entrenador_id, formData.equipo_id, formData.fecha);
          setToastMessage('Asistencia creada correctamente');
          setShowModal(false);
          cargarDatos();
      } catch (error) {
        console.error('Error al crear lista de asistencia:', error);
        setToastMessage('Error al crear lista de asistencia');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (id: number) => {
      setLoading(true);
      try {
        await asistenciaService.delete(id);
        setToastMessage('Asistencia eliminada correctamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        setToastMessage('Error al eliminar la asistencia');
      } finally {
        setLoading(false);
      }
    };
  
    const abrirModalEditar = (asistencia: Asistencia) => {
      setAsistenciaEditar(asistencia);
      setFormData({
        fecha: asistencia.fecha,
        equipo_id: asistencia.equipo_id?.toString() || '',
        deportista_id: asistencia.deportista_id.toString(),
        entrenador_id: asistencia.entrenador_id.toString(),
        estado: asistencia.estado as 'presente' | 'ausente' | 'justificado',
        observaciones: asistencia.observaciones || '',
        nombre: asistencia.nombre || '',
        entrenador: asistencia.entrenador || ''
      });
      setShowModal(true);
    };
  
    const abrirModalCrear = () => {
      const user = AuthService.getCurrentUser();
      setAsistenciaEditar(null);
      setFormData({
        fecha: new Date().toISOString(),
        equipo_id: '',
        deportista_id: '',
        entrenador_id: user?.id || '',
        estado: 'presente',
        observaciones: '',
        nombre: '',
        entrenador: ''
      });
      setShowModal(true);
    };
  
    const getEstadoColor = (estado: string) => {
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
  
    const getEstadoTexto = (estado: string) => {
      switch (estado) {
        case 'presente':
          return 'Presente';
        case 'ausente':
          return 'Ausente';
        case 'justificado':
          return 'Justificado';
        default:
          return estado;
      }
    };
  
    const getDeportistaNombre = (deportistaId: string) => {
      const deportista = deportistas.find(d => d.id === parseInt(deportistaId));
      return deportista ? `${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}` : 'Desconocido';
    };
  
    const asistenciasFiltradas = asistencias.filter(asistencia => {
      const deportistaNombre = getDeportistaNombre(asistencia.deportista_id).toLowerCase();
      return deportistaNombre.includes(searchText.toLowerCase());
    });
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Asistencias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar por Asistencia..."
          />
  
          <IonList>
            {asistenciasFiltradas.map((asistencia) => (
              <IonItem key={asistencia.id} button onClick={() => history.push(`/entrenador/asistencia/${asistencia.id}/deportistas`, {
                equipoNombre: asistencia.nombre,
                fecha: asistencia.fecha
              })}>
                <IonLabel>
                  <h5>{asistencia.nombre}</h5>
                  <p>{asistencia.entrenador}</p>
                  <p>Fecha: {new Date(asistencia.fecha).toLocaleDateString()}</p>
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton onClick={() => abrirModalEditar(asistencia)}>
                    <IonIcon icon={create} />
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
            breakpoints={[0, 1]}
            initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Registrar Asistencia</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmit}>
                <IonInput
                  type="date"
                  label="Fecha"
                  labelPlacement="floating"
                  value={formData.fecha}
                  onIonChange={e => setFormData({...formData, fecha: e.detail.value!})}
                  required
                />
                <IonSelect
                  label="Equipo"
                  labelPlacement="floating"
                  value={formData.equipo_id}
                  onIonChange={e => setFormData({...formData, equipo_id: e.detail.value})}
                  required
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
                  {equipos.map(equipo => (
                    <IonSelectOption key={equipo.id} value={equipo.id.toString()}>
                      {equipo.nombre}
                    </IonSelectOption>
                  ))}
                </IonSelect>

                <IonButton expand="block" type="submit" className="ion-margin-top">
                  Crear Lista
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
        </IonContent>
      </IonPage>
    );
  };
  
  export default Asistencias; 