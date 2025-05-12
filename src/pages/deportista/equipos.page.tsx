import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToast,
  IonAvatar,
  IonImg,

} from '@ionic/react';
import { people } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { equipoService } from '../../services/equipos.service';
import { useHistory } from 'react-router-dom';
import { Equipo } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import { SUPABASE_STORAGE_URL } from '../../services/supabase.service';

const DeportistaEquiposPage: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      setLoading(true);
      const equiposData = await equipoService.getEquiposDeportista();
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setToastMessage('Error al cargar los equipos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipoClick = (equipoId: string) => {
    history.push(`/deportista/equipos/${equipoId}/deportistas`);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'default_cheer.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${SUPABASE_STORAGE_URL}/equipos/${imagePath}`;
  };
    

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Equipos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {equipos.map((equipo) => (
            <IonItem key={equipo.equipo_id} button onClick={() => handleEquipoClick(equipo.equipo_id)}>
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
      </IonContent>
    </IonPage>
  );
};

export default DeportistaEquiposPage; 