import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonToast,
  IonBackButton
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { deportistaService } from '../../services/deportistas.service';
import LoadingOverlay from '../../components/LoadingOverlay';

const DeportistaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [deportista, setDeportista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await deportistaService.getById(id);
      setDeportista(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToastMessage('Error al cargar los datos del deportista');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/entrenador/deportistas" />
          </IonButtons>
          <IonTitle>Información del Deportista</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {deportista && (
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>R.U.N.</h2>
                <p>{deportista.run}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Nombres</h2>
                <p>{deportista.nombres}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Apellido Paterno</h2>
                <p>{deportista.ap_paterno}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Apellido Materno</h2>
                <p>{deportista.ap_materno}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <p>{deportista.email}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Dirección</h2>
                <p>{deportista.direccion || 'No especificada'}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Teléfono</h2>
                {deportista.fono ? (
                  <a href={`tel:${deportista.fono}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <p>{deportista.fono}</p>
                  </a>
                ) : (
                  <p>No especificado</p>
                )}
              </IonLabel>
            </IonItem>
          </IonList>
        )}

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

export default DeportistaDetalle; 