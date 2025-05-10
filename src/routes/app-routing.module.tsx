import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from '../pages/auth/login.page';
import EntrenadorLayout from '../layouts/EntrenadorLayout';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

const AppRoutes: React.FC = () => {
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

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/admin" />
          
          {/* Rutas del Entrenador */}
          <Route path="/entrenador" component={EntrenadorLayout} />

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