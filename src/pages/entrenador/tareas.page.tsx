import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { people, peopleOutline, person, personOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

const TareasPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <AppHeader title="Tareas" />
      <IonContent>      
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/entrenador/tareas-equipo')} style={{ marginBottom: '16px', background: '#dddddd', color: '#000000', borderRadius: '12px', boxShadow: '0 4px 12px rgba(81, 233, 21, 0.1)' }}>
                <IonCardHeader>
                  <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IonIcon icon={peopleOutline} color="danger"/>
                    Tareas de Equipo
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Gestiona las tareas asignadas a equipos completos. Crea, edita y realiza seguimiento de las actividades grupales.
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard button onClick={() => history.push('/entrenador/tareas-deportista')} style={{ marginBottom: '16px', background: '#dddddd', color: '#000000', borderRadius: '12px', boxShadow: '0 4px 12px rgba(81, 233, 21, 0.1)' }}>
                <IonCardHeader>
                  <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IonIcon icon={personOutline} color="danger" />
                    Tareas de Deportista
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Administra las tareas individuales de los deportistas. Asigna, modifica y evalúa las actividades personales.</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TareasPage; 