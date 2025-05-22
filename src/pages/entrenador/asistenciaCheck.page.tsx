import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonToast,
  IonChip,
  IonButtons
} from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { asistenciaService } from '../../services/asistencia.service';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import BackButton from '../../components/BackButton';

const estados = [
  { value: 'presente', label: 'Presente' },
  { value: 'ausente', label: 'Ausente' },
  { value: 'justificado', label: 'Justificado' }
];

const AsistenciaCheckPage: React.FC = () => {
  const { asistenciaId } = useParams<{ asistenciaId: string }>();
  const [deportistas, setDeportistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  const location = useLocation();
  const { equipoNombre, fecha } = location.state as { equipoNombre?: string; fecha?: string } || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Obtener deportistas asociados a la asistencia
        const lista = await asistenciaService.listarAsistDeportistas(asistenciaId);
        setDeportistas(lista);
      } catch (error) {
        setToastMessage('Error al cargar deportistas');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [asistenciaId]);

  const openEditModal = (idx: number) => {
    setEditIndex(idx);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleEditEstado = (value: string) => {
    if (editIndex === null) return;
    const nuevos = [...deportistas];
    nuevos[editIndex].estado = value;
    setDeportistas(nuevos);
  };

  const handleEditObservacion = (value: string) => {
    if (editIndex === null) return;
    const nuevos = [...deportistas];
    nuevos[editIndex].observacion = value;
    setDeportistas(nuevos);
  };

  const handleSaveEdit = async () => {
    if (editIndex === null) return;
    const dep = deportistas[editIndex];
    setLoading(true);
    try {
      await asistenciaService.updAsistenciaDep(dep.id, dep.estado, dep.observacion);
      setToastMessage('Asistencia actualizada correctamente');
      setShowToast(true);
      // Refrescar la lista
      const lista = await asistenciaService.listarAsistDeportistas(asistenciaId);
      setDeportistas(lista);
      closeEditModal();
    } catch (error) {
      setToastMessage('Error al actualizar asistencia');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>
            {equipoNombre && fecha
              ? `${equipoNombre} - ${new Date(fecha).toLocaleDateString()}`
              : 'Asistencia'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {deportistas.map((dep, idx) => (
            <IonItem key={dep.id} button onClick={() => openEditModal(idx)}>
              <IonLabel className="ion-text-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IonChip color={getEstadoColor(dep.estado)} style={{ height: 22, fontSize: 13, marginLeft: 8 }}>
                    {estados.find(e => e.value === dep.estado)?.label || dep.estado}
                  </IonChip>                  
                  <span>{dep.deportista}</span>
                </div>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <AccessibleModal isOpen={showEditModal} onDidDismiss={closeEditModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Asistencia</IonTitle>
              <IonButton slot="end" onClick={closeEditModal}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {editIndex !== null && (
              <>
                <h2>{deportistas[editIndex].deportista}</h2>
                <IonSelect
                  value={deportistas[editIndex].estado}
                  placeholder="Estado"
                  onIonChange={e => handleEditEstado(e.detail.value)}
                  style={{ minWidth: 120, marginBottom: 16 }}
                >
                  {estados.map(e => (
                    <IonSelectOption key={e.value} value={e.value}>{e.label}</IonSelectOption>
                  ))}
                </IonSelect>
                <IonTextarea
                  value={deportistas[editIndex].observacion}
                  placeholder="Observación"
                  onIonChange={e => handleEditObservacion(e.detail.value!)}
                  style={{ width: '100%', minHeight: 48 }}
                />
                <IonButton expand="block" onClick={handleSaveEdit} style={{ marginTop: 16 }}>Guardar</IonButton>
              </>
            )}
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

export default AsistenciaCheckPage;
