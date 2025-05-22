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
  calendar
} from 'ionicons/icons';
import { Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import AccessibleRouterOutlet from '../components/AccessibleRouterOutlet';
import DashboardPage from '../pages/entrenador/dashboard.page';
import EquiposPage from '../pages/entrenador/equipo.page';
import EquipoDeportistaPage from '../pages/entrenador/equipoDeportista.page';
import DeportistasPage from '../pages/entrenador/deportistas.page';
import DeportistaDetallePage from '../pages/entrenador/deportistaDetalle.page';
import TareasPage from '../pages/entrenador/tareas.page';
import AsistenciaPage from '../pages/entrenador/asistencia.page';
import CalendarioPage from '../pages/entrenador/calendario.page';
import AsistenciaCheckPage from '../pages/entrenador/asistenciaCheck.page';
import TareaDetalle from '../pages/entrenador/tarea-detalle.page';
import EntrenadorPerfilPage from '../pages/entrenador/perfil.page';

const EntrenadorLayout: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const routerOutlet = document.querySelector('ion-router-outlet');
    if (routerOutlet) {
      // Remover aria-hidden si existe
      routerOutlet.removeAttribute('aria-hidden');
      // Usar inert en su lugar
      (routerOutlet as HTMLElement).inert = false;

      // Observar cambios en el atributo aria-hidden
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
        <Route exact path="/entrenador/dashboard" component={DashboardPage} />
        <Route exact path="/entrenador/equipos" component={EquiposPage} />          
        <Route exact path="/entrenador/equipos/:equipoId/deportistas" component={EquipoDeportistaPage} />
        <Route exact path="/entrenador/deportistas" component={DeportistasPage} />
        <Route exact path="/entrenador/deportistas/:id" component={DeportistaDetallePage} />
        <Route exact path="/entrenador/tareas" component={TareasPage} />
        <Route exact path="/entrenador/tareas/:id" component={TareaDetalle}  />
        <Route exact path="/entrenador/asistencia" component={AsistenciaPage} />
        <Route exact path="/entrenador/asistencia/:asistenciaId/deportistas" component={AsistenciaCheckPage} />
        <Route exact path="/entrenador/calendario" component={CalendarioPage} />
        <Route exact path="/entrenador/perfil" component={EntrenadorPerfilPage}/>
        <Route exact path="/entrenador/notificaciones">
          <div className="ion-padding">
            <h2>Notificaciones</h2>
          </div>
        </Route>
        <Route exact path="/entrenador">
          <Redirect to="/entrenador/dashboard" />
        </Route>

      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/entrenador/dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tareas" href="/entrenador/tareas">
          <IonIcon icon={checkmarkCircleOutline} />
          <IonLabel>Tareas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="asistencia" href="/entrenador/asistencia">
          <IonIcon icon={clipboard} />
          <IonLabel>Asistencia</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendario" href="/entrenador/calendario">
          <IonIcon icon={calendar} />
          <IonLabel>Calendario</IonLabel>
        </IonTabButton>
        <IonTabButton tab="equipos" href="/entrenador/equipos">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Equipos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="deportistas" href="/entrenador/deportistas">
          <IonIcon icon={personOutline} />
          <IonLabel>Deportistas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/entrenador/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default EntrenadorLayout; 