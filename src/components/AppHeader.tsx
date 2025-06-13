import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton
} from '@ionic/react';
import { personCircle, logOutOutline } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { supabase, SUPABASE_STORAGE_URL } from '../services/supabase.service';
import { useHistory } from 'react-router-dom';
import { App } from '@capacitor/app';

interface UserData {
  nombres: string;
  ap_paterno: string;
  avatar?: string;
}

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = 'CheerUp' }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const history = useHistory();

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = () => {
    try {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    history.push('/login');
      // Espera un poco o realiza animaciones si deseas
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cerrar la app (funciona solo en dispositivos reales, no en navegador)
    await App.exitApp();
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="primary">
          <IonAvatar style={{ width: '32px', height: '32px', marginLeft: 8 }}>
            {userData?.avatar ? (
              <img src={`${SUPABASE_STORAGE_URL}/users/${userData.avatar}`} alt="Avatar" />
              
            ) : (
              <IonIcon icon={personCircle} style={{ fontSize: '32px' }} />
            )}
          </IonAvatar>
          <IonLabel style={{ marginLeft: 8, fontSize: 14 }}>
            {userData ? `${userData.nombres} ${userData.ap_paterno}` : 'Usuario'}
          </IonLabel>
        </IonButtons>
        <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader; 