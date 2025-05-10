import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from '../pages/auth/login.page';
import EntrenadorLayout from '../layouts/EntrenadorLayout';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

const AppRoutes: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/admin" />
          
          {/* Rutas del Entrenador */}
          <Route path="/entrenador" component={EntrenadorLayout}>
            <EntrenadorLayout />          
          </Route>

          <Route exact path="/deportista">
            <div>Página de Deportista</div>
          </Route>
          
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppRoutes; 