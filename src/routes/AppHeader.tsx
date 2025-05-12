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
import { personCircle } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { supabase, SUPABASE_STORAGE_URL } from '../services/supabase.service';

interface UserData {
  nombres: string;
  ap_paterno: string;
  avatar?: string;
}

const AppHeader: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('nombres, ap_paterno, avatar')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data.avatar) {
        data.avatar = `${SUPABASE_STORAGE_URL}/users/${data.avatar}`;
      }

      setUserData(data);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>CheerUp</IonTitle>
        <IonButtons slot="end">
          <IonItem lines="none" className="ion-no-padding">
            <IonAvatar slot="start" style={{ width: '32px', height: '32px' }}>
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Avatar" />
              ) : (
                <IonIcon icon={personCircle} style={{ fontSize: '32px' }} />
              )}
            </IonAvatar>
            <IonLabel className="ion-padding-start">
              {userData ? `${userData.nombres} ${userData.ap_paterno}` : 'Usuario'}
            </IonLabel>
          </IonItem>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader; 