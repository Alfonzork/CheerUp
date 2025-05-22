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
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonToast,
    IonSearchbar,
    IonBackButton,
    IonAlert,
    IonListHeader
  } from '@ionic/react';
  import { add, person, trash, arrowBack } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import { useParams, useHistory } from 'react-router-dom';
  import { deportistaService } from '../../services/deportistas.service';
  import { equipoService } from '../../services/equipos.service';
  import { equipoMiembrosService } from '../../services/eqmiembros.service';
  import LoadingOverlay from '../../components/LoadingOverlay';
  import AccessibleModal from '../../components/AccessibleModal';
  import BackButton from '../../components/BackButton';
  
  const EquipoDeportistas: React.FC = () => {
    const { equipoId } = useParams<{ equipoId: string }>();
    const history = useHistory();
    const [deportistas, setDeportistas] = useState<any[]>([]);
    const [todosDeportistas, setTodosDeportistas] = useState<any[]>([]);
    const [equipo, setEquipo] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const [deportistaSeleccionado, setDeportistaSeleccionado] = useState<string>('');
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [deportistaToDelete, setDeportistaToDelete] = useState<string | null>(null);
    const [searchModalText, setSearchModalText] = useState('');
  
    const handleVolver = () => {
      history.push('/entrenador/equipos');
    };
  
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [equipoData, deportistasData] = await Promise.all([
          equipoService.getById(equipoId),
          deportistaService.getAllByEquipo(equipoId)
        ]);
  
        setEquipo(equipoData);
        setDeportistas(deportistasData);
        
        // Cargar todos los deportistas para el modal de agregar
        const todosDeportistasData = await deportistaService.getAll();
        setTodosDeportistas(todosDeportistasData);
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
    }, [equipoId]);
  
    const handleAgregarDeportista = async () => {
      if (!deportistaSeleccionado) return;
  
      try {
        setLoading(true);
        const fechaActual = new Date().toISOString();
        
        // Desactivar membresía anterior si existe
        const deportista = todosDeportistas.find(d => d.id === deportistaSeleccionado);
        if (deportista?.equipo_miembros?.length > 0) {
          const membresiaAnterior = deportista.equipo_miembros.find((em: any) => em.activo);
          if (membresiaAnterior) {
            await equipoMiembrosService.update(membresiaAnterior.id, { activo: false });
          }
        }
  
        // Crear nueva membresía
        await equipoMiembrosService.create({
          equipo_id: equipoId,
          deportista_id: deportistaSeleccionado,
          fecha_ingreso: fechaActual,
          activo: true
        });
  
        setToastMessage('Deportista agregado correctamente');
        setShowModal(false);
        setSearchModalText('');
        cargarDatos();
      } catch (error) {
        console.error('Error al agregar deportista:', error);
        setToastMessage('Error al agregar el deportista');
      } finally {
        setLoading(false);
      }
    };
  
    const handleEliminarDeportista = async (miembroId: string) => {
      setDeportistaToDelete(miembroId);
      setShowDeleteAlert(true);
    };
  
    const confirmDelete = async () => {
      if (!deportistaToDelete) return;
  
      try {
        setLoading(true);
        await equipoMiembrosService.delete(deportistaToDelete);
        setToastMessage('Deportista eliminado del equipo correctamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar deportista:', error);
        setToastMessage('Error al eliminar el deportista');
      } finally {
        setLoading(false);
        setDeportistaToDelete(null);
      }
    };
  
    const deportistasFiltrados = deportistas.filter(deportista => {
      const nombreCompleto = `${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}`.toLowerCase();
      const searchLower = searchText.toLowerCase();
      return nombreCompleto.includes(searchLower);
    });
  
    // Filtrar deportistas que no están en el equipo para el modal
    const deportistasDisponibles = todosDeportistas.filter(deportista => 
      !deportistas.some(d => d.id === deportista.id)
    );
  
    // Filtrar deportistas disponibles según el texto de búsqueda
    const deportistasDisponiblesFiltrados = deportistasDisponibles.filter(deportista => {
      const nombreCompleto = `${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}`.toLowerCase();
      return nombreCompleto.includes(searchModalText.toLowerCase());
    });
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton />
            </IonButtons>
            <IonTitle>{equipo?.nombre || 'Equipo'} ({deportistasFiltrados.length})</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonChange={e => setSearchText(e.detail.value!)}
              placeholder="Buscar deportistas..."
              className="ion-no-padding"
            />
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {deportistasFiltrados.map((deportista) => (
              <IonItem key={deportista.id}>
                <IonIcon icon={person} slot="start" />
                <IonLabel>
                  <h2>{`${deportista.deportista}`}</h2>
                  <p>Fecha Ingreso: {deportista.fecha_ingreso}</p>
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
  
          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => {
              setShowDeleteAlert(false);
              setDeportistaToDelete(null);
            }}
            header="Confirmar eliminación"
            message="¿Está seguro que desea eliminar este deportista del equipo?"
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
  
  export default EquipoDeportistas; 