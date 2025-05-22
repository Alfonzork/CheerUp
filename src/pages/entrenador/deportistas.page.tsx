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
  IonButtons,
  IonToast,
  IonSearchbar,
  IonAlert
} from '@ionic/react';
import { add, create, trash, person } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { deportistaService } from '../../services/deportistas.service';
import { subscribeToChanges } from '../../services/changes.service';
import { Equipo } from '../../models/supabase.model';
import { useHistory } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import { App } from '@capacitor/app';
import AppHeader from '../../components/AppHeader';

const Deportistas: React.FC = () => {
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deportistaEditar, setDeportistaEditar] = useState<any | null>(null);
  const [searchText, setSearchText] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    run: '',
    nombres: '',
    ap_paterno: '',
    ap_materno: '',
    email: '',
    password: ''
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deportistaToDelete, setDeportistaToDelete] = useState<string | null>(null);
  const history = useHistory();

  const cargarDatos = async () => {
    try {
      const deportistasData = await deportistaService.getAll();
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

    // Suscribirse a cambios en tiempo real
    const subscription = subscribeToChanges('deportistas', (payload) => {
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
      const deportistaData = {
        id: formData.id,
        nombres: formData.nombres,
        ap_paterno: formData.ap_paterno,
        ap_materno: formData.ap_materno,
        email: formData.email,
        password: formData.password,
        tipo_usuario: 'deportista'
      };

      if (deportistaEditar) {
        await deportistaService.update(deportistaEditar.id, deportistaData);
      } else {
        await deportistaService.create(deportistaData);
      }

      setToastMessage(deportistaEditar ? 'Deportista actualizado correctamente' : 'Deportista creado correctamente');
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar deportista:', error);
      setToastMessage('Error al guardar el deportista');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeportistaToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!deportistaToDelete) return;

    setLoading(true);
    try {
      await deportistaService.delete(deportistaToDelete);
      setToastMessage('Deportista desactivado correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al desactivar deportista:', error);
      setToastMessage('Error al desactivar el deportista');
    } finally {
      setLoading(false);
      setDeportistaToDelete(null);
    }
  };

  const abrirModalEditar = async (deportista: any) => {
    setDeportistaEditar(deportista);
    setFormData({
      id: deportista.id,
      run: deportista.run,
      nombres: deportista.nombres,
      ap_paterno: deportista.ap_paterno,
      ap_materno: deportista.ap_materno,
      email: deportista.email,
      password: '' // No mostramos la contraseña al editar
    });
    setShowModal(true);
  };

  const abrirModalCrear = () => {
    setDeportistaEditar(null);
    setFormData({
      id: '',
      run: '',
      nombres: '',
      ap_paterno: '',
      ap_materno: '',
      email: '',
      password: ''
    });
    setShowModal(true);
  };

  const deportistasFiltrados = deportistas.filter(deportista => {
    const nombreCompleto = `${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}`.toLowerCase();
    const nombreEquipo = deportista.nombre_equipos?.toLowerCase() || '';
    const searchLower = searchText.toLowerCase();

    return nombreCompleto.includes(searchLower) ||
      nombreEquipo.includes(searchLower);
  });

  const getEquipoNombre = (equipoId: number) => {
    const equipo = equipos.find(e => e.id === equipoId);
    return equipo ? equipo.nombre : 'Sin equipo';
  };

  const handleDeportistaClick = (id: string) => {
    history.push(`/entrenador/deportistas/${id}`);
  };

  return (
    <IonPage>
      <AppHeader title="Deportistas" />
      <IonToolbar >
        <IonTitle>Total Deportistas ({deportistasFiltrados.length})</IonTitle>
        <IonSearchbar
          value={searchText}
          onIonChange={e => setSearchText(e.detail.value!)}
          placeholder="Buscar por nombre o equipo..."
          className="ion-no-padding"
        />
      </IonToolbar>
      <IonContent className="ion-padding">        
        <IonList>
          {deportistasFiltrados.map((deportista) => (
            <IonItem key={deportista.id} button onClick={() => handleDeportistaClick(deportista.id)}>
              <IonIcon icon={person} slot="start" />
              <IonLabel>
                <h2>{`${deportista.nombres} ${deportista.ap_paterno} ${deportista.ap_materno}`}</h2>
                <p>Equipo: {deportista.nombre_equipos ?? 'Sin Equipo'}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton onClick={(e) => {
                  e.stopPropagation();
                  abrirModalEditar(deportista);
                }}>
                  <IonIcon icon={create} color='primary'/>
                </IonButton>
                <IonButton onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(deportista.id);
                }}>
                  <IonIcon icon={trash} color='danger'/>
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
              <IonTitle>{deportistaEditar ? 'Editar Deportista' : 'Nuevo Deportista'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={handleSubmit}>
              <IonInput
                label="R.U.N."
                labelPlacement="floating"
                value={formData.run}
                onIonChange={e => setFormData({ ...formData, run: e.detail.value! })}
                required
              />
              <IonInput
                label="Nombre"
                labelPlacement="floating"
                value={formData.nombres}
                onIonChange={e => setFormData({ ...formData, nombres: e.detail.value! })}
                required
              />
              <IonInput
                label="Apellido Paterno"
                labelPlacement="floating"
                value={formData.ap_paterno}
                onIonChange={e => setFormData({ ...formData, ap_paterno: e.detail.value! })}
                required
              />
              <IonInput
                label="Apellido Materno"
                labelPlacement="floating"
                value={formData.ap_materno}
                onIonChange={e => setFormData({ ...formData, ap_materno: e.detail.value! })}
                required
              />
              <IonInput
                type="email"
                label="Email"
                labelPlacement="floating"
                value={formData.email}
                onIonChange={e => setFormData({ ...formData, email: e.detail.value! })}
                required
              />
              {!deportistaEditar && (
                <IonInput
                  type="password"
                  label="Contraseña"
                  labelPlacement="floating"
                  value={formData.password}
                  onIonChange={e => setFormData({ ...formData, password: e.detail.value! })}
                  required
                />
              )}
              <IonButton expand="block" type="submit" className="ion-margin-top">
                {deportistaEditar ? 'Actualizar' : 'Crear'}
              </IonButton>
            </form>
          </IonContent>
        </AccessibleModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => {
            setShowDeleteAlert(false);
            setDeportistaToDelete(null);
          }}
          header="Confirmar desactivación"
          message="¿Está seguro que desea desactivar este deportista? El deportista no será eliminado, solo se marcará como inactivo."
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Desactivar',
              handler: confirmDelete
            }
          ]}
        />

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

export default Deportistas; 