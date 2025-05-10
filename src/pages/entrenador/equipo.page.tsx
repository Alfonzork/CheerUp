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
    IonTextarea,
    IonButtons,
    IonToast,
    IonImg,
    IonAvatar,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonAlert,
  } from '@ionic/react';
  import { add, create, trash, people } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import { equipoService } from '../../services/equipos.service';
  import { subscribeToChanges } from '../../services/changes.service';
  import { Equipo } from '../../models/supabase.model';
  import { supabase, SUPABASE_STORAGE_URL } from '../../services/supabase.service';
  import { useHistory } from 'react-router';
  import LoadingOverlay from '../../components/LoadingOverlay';
  import AccessibleModal from '../../components/AccessibleModal';
  
  interface Entrenador {
    id: number;
    entrenador: string;
  }
  
  const Equipos: React.FC = () => {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [equipoEditar, setEquipoEditar] = useState<Equipo | null>(null);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
      image: '',
      entrenador_id: 0,
      activo: true,
      updated_at: new Date().toISOString()
    });
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [equipoToDelete, setEquipoToDelete] = useState<number | null>(null);
    const history = useHistory();
  
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        const [equiposData, entrenadoresData] = await Promise.all([
          equipoService.getAll(),
          supabase.from('entrenadores').select('id, entrenador').eq('activo', true)
        ]);
        
        setEquipos(equiposData);
        if (entrenadoresData.data) {
          setEntrenadores(entrenadoresData.data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setToastMessage('Error al cargar los datos');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      cargarDatos();
  
      // Suscribirse a cambios en tiempo real
      const subscription = subscribeToChanges('equipos', (payload) => {
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
        if (equipoEditar) {
          await equipoService.update(equipoEditar.id, formData);
          setToastMessage('Equipo actualizado correctamente');
        } else {
          await equipoService.create(formData);
          setToastMessage('Equipo creado correctamente');
        }
        setShowModal(false);
        cargarDatos();
      } catch (error) {
        console.error('Error al guardar equipo:', error);
        setToastMessage('Error al guardar el equipo');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (id: number) => {
      setEquipoToDelete(id);
      setShowDeleteAlert(true);
    };
  
    const confirmDelete = async () => {
      if (!equipoToDelete) return;
      
      setLoading(true);
      try {
        await equipoService.delete(equipoToDelete);
        setToastMessage('Equipo eliminado correctamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        setToastMessage('Error al eliminar el equipo');
      } finally {
        setLoading(false);
        setEquipoToDelete(null);
      }
    };
  
    const abrirModalEditar = (equipo: Equipo) => {
      setEquipoEditar(equipo);
      setFormData({
        nombre: equipo.nombre,
        descripcion: equipo.descripcion,
        image: equipo.image,
        entrenador_id: equipo.entrenador_id,
        activo: equipo.activo,
        updated_at: new Date().toISOString()
      });
      setShowModal(true);
    };
  
    const abrirModalCrear = () => {
      setEquipoEditar(null);
      setFormData({
        nombre: '',
        descripcion: '',
        image: '',
        entrenador_id: 0,
        activo: true,
        updated_at: new Date().toISOString()
      });
      setShowModal(true);
    };
  
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          setLoading(true);
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;
  
          const { error: uploadError, data } = await supabase.storage
            .from('equipos')
            .upload(filePath, file);
  
          if (uploadError) {
            throw uploadError;
          }
  
          const imageUrl = `${SUPABASE_STORAGE_URL}/equipos/${filePath}`;
          setFormData({ ...formData, image: imageUrl });
        } catch (error) {
          console.error('Error al subir imagen:', error);
          setToastMessage('Error al subir la imagen');
          setShowToast(true);
        } finally {
          setLoading(false);
        }
      }
    };
  
    const getImageUrl = (imagePath: string) => {
      if (!imagePath) return 'default_cheer.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      return `${SUPABASE_STORAGE_URL}/equipos/${imagePath}`;
    };
  
    const equiposFiltrados = equipos.filter(equipo => 
      equipo.activo && (
        equipo.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        equipo.descripcion.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  
    const handleEquipoClick = (equipoId: number) => {
      history.push(`/entrenador/equipos/${equipoId}/deportistas`);
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Equipos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {error ? (
            <div className="ion-text-center ion-padding">
              <p>{error}</p>
              <IonButton onClick={cargarDatos}>Reintentar</IonButton>
            </div>
          ) : (
            <>
              <IonSearchbar
                value={searchText}
                onIonChange={e => setSearchText(e.detail.value!)}
                placeholder="Buscar equipos..."
              />
  
              <IonList>
                {equiposFiltrados.map((equipo) => (
                  <IonItem key={equipo.id} button onClick={() => handleEquipoClick(equipo.id)}>
                    <IonAvatar slot="start" style={{ width: '40px', height: '40px' }}>
                      <IonImg 
                        src={getImageUrl(equipo.image)} 
                        alt={equipo.nombre}
                        style={{ objectFit: 'cover' }}
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>{equipo.nombre}</h2>
                      <p>{equipo.descripcion}</p>
                    </IonLabel>
                    <IonButtons slot="end">
                      <IonButton onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEditar(equipo);
                      }}>
                        <IonIcon icon={create} />
                      </IonButton>
                      <IonButton onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(equipo.id);
                      }}>
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
            </>
          )}
  
          <AccessibleModal
            isOpen={showModal} 
            onDidDismiss={() => setShowModal(false)}
            breakpoints={[0, 0.8]}
            initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>{equipoEditar ? 'Editar Equipo' : 'Nuevo Equipo'}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmit}>
                <div className="ion-text-center ion-margin-bottom">
                  <IonAvatar style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                    <IonImg 
                      src={getImageUrl(formData.image)} 
                      alt="Imagen del equipo"
                      style={{ objectFit: 'cover' }}
                    />
                  </IonAvatar>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <IonButton fill="clear" onClick={() => document.getElementById('image-upload')?.click()}>
                    Cambiar Imagen
                  </IonButton>
                </div>
                <IonInput
                  label="Nombre"
                  labelPlacement="floating"
                  value={formData.nombre}
                  onIonChange={e => setFormData({...formData, nombre: e.detail.value!})}
                  required
                />
                <IonTextarea
                  label="Descripción"
                  labelPlacement="floating"
                  value={formData.descripcion}
                  onIonChange={e => setFormData({...formData, descripcion: e.detail.value!})}
                  rows={4}
                />
                <IonSelect
                  label="Entrenador"
                  labelPlacement="floating"
                  value={formData.entrenador_id}
                  onIonChange={e => setFormData({...formData, entrenador_id: e.detail.value})}
                  required
                >
                  <IonSelectOption value={0} disabled>Seleccione un entrenador</IonSelectOption>
                  {entrenadores.map(entrenador => (
                    <IonSelectOption key={entrenador.id} value={entrenador.id}>
                      {entrenador.entrenador}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  {equipoEditar ? 'Actualizar' : 'Crear'}
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
  
          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => setShowDeleteAlert(false)}
            header="Confirmar eliminación"
            message="¿Está seguro que desea eliminar este equipo? Esta acción no se puede deshacer."
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
  
  export default Equipos; 