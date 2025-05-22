import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonButtons,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { 
  peopleOutline, 
  calendarOutline, 
  statsChartOutline, 
  settingsOutline,
  logOutOutline,
  homeOutline,
  personOutline,
  notificationsOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

const EntrenadorDashboard: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <IonPage>
      <AppHeader title="Dashboard" />

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={peopleOutline} /> Deportistas
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Gestiona tus deportistas</p>
                  <IonButton expand="block" routerLink="/entrenador/atletas">
                    Ver Atletas
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={calendarOutline} /> Programas
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Gestiona programas de entrenamiento</p>
                  <IonButton expand="block" routerLink="/entrenador/programas">
                    Ver Programas
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={statsChartOutline} /> Estadísticas
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Visualiza el progreso de tus deportistas</p>
                  <IonButton expand="block" routerLink="/entrenador/estadisticas">
                    Ver Estadísticas
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={settingsOutline} /> Configuración
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Configura tu perfil y preferencias</p>
                  <IonButton expand="block" routerLink="/entrenador/configuracion">
                    Configurar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorDashboard; 