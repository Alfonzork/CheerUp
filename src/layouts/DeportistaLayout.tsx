import React, { useEffect } from 'react';
import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  IonRouterOutlet,
  IonRouterLink,
  IonTabs
} from '@ionic/react';
import { 
  homeOutline, 
  peopleOutline, 
  personOutline, 
  notificationsOutline,
  logOutOutline,
  checkmarkCircleOutline,
  clipboard,
  calendar,
  book,
  bookOutline,
  clipboardOutline,
  calendarOutline
} from 'ionicons/icons';
import { Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import AccessibleRouterOutlet from '../components/AccessibleRouterOutlet';
import DeportistaDashboardPage from '../pages/deportista/dashboard.page';
import DeportistaEquiposPage from '../pages/deportista/equipos.page';
import DeportistaTareasPage from '../pages/deportista/tareas.page';
import DeportistaAsistenciaPage from '../pages/deportista/asistencia.page';
import EquipoDeportistaPage from '../pages/deportista/equipoDeportista.page';
import DeportistaPerfilPage from '../pages/deportista/perfil.page';
import DeportistaCalendarioPage from '../pages/deportista/calendario.page';
import DeportistaTutorialPage from '../pages/deportista/tutorial.page';

const DeportistaLayout: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const routerOutlet = document.querySelector('ion-router-outlet');
    if (routerOutlet) {
      routerOutlet.removeAttribute('aria-hidden');
      (routerOutlet as HTMLElement).inert = false;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            routerOutlet.removeAttribute('aria-hidden');
            (routerOutlet as HTMLElement).inert = false;
          }
        });
      });

      observer.observe(routerOutlet, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });

      return () => observer.disconnect();
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    history.push('/login');
  };

  return (    
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/deportista/dashboard" component={DeportistaDashboardPage} />
        <Route exact path="/deportista/equipos" component={DeportistaEquiposPage} />
        <Route exact path="/deportista/tareas" component={DeportistaTareasPage} />
        <Route exact path="/deportista/asistencia" component={DeportistaAsistenciaPage} />
        <Route exact path="/deportista/equipos/:equipoId/deportistas" component={EquipoDeportistaPage} />
        <Route exact path="/deportista/tutorial" component={DeportistaTutorialPage} />
        <Route exact path="/deportista/calendario" component={DeportistaCalendarioPage} />
        <Route exact path="/deportista/perfil" component={DeportistaPerfilPage} />
        <Route exact path="/deportista">
          <Redirect to="/deportista/dashboard" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/deportista/dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="equipos" href="/deportista/equipos">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Equipos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tareas" href="/deportista/tareas">
          <IonIcon icon={checkmarkCircleOutline} />
          <IonLabel>Tareas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="asistencia" href="/deportista/asistencia">
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Asistencia</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tutorial" href="/deportista/tutorial">
          <IonIcon icon={bookOutline} />
          <IonLabel>Tutorial</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendario" href="/deportista/calendario">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Calendario</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/deportista/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default DeportistaLayout;
