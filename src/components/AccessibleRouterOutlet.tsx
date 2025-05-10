import React, { useEffect } from 'react';
import { IonRouterOutlet } from '@ionic/react';

interface AccessibleRouterOutletProps {
  children: React.ReactNode;
}

const AccessibleRouterOutlet: React.FC<AccessibleRouterOutletProps> = ({ children }) => {
  useEffect(() => {
    // Buscar el ion-router-outlet en el DOM
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

  return <IonRouterOutlet>{children}</IonRouterOutlet>;
};

export default AccessibleRouterOutlet; 