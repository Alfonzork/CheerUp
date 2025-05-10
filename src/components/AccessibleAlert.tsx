import React, { useEffect, useRef } from 'react';
import { IonAlert } from '@ionic/react';

interface AccessibleAlertProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  header?: string;
  message?: string;
  buttons?: any[];
  [key: string]: any;
}

const AccessibleAlert: React.FC<AccessibleAlertProps> = ({ isOpen, onDidDismiss, ...props }) => {
  const alertRef = useRef<HTMLIonAlertElement>(null);

  useEffect(() => {
    if (isOpen && alertRef.current) {
      const alertElement = alertRef.current;
      
      // Remover aria-hidden y usar inert
      alertElement.removeAttribute('aria-hidden');
      alertElement.inert = false;

      // Observar cambios en aria-hidden
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'aria-hidden') {
            alertElement.removeAttribute('aria-hidden');
            alertElement.inert = false;
          }
        });
      });

      observer.observe(alertElement, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });

      return () => {
        observer.disconnect();
        // Limpiar al cerrar
        setTimeout(() => {
          const alerts = document.querySelectorAll('ion-alert');
          alerts.forEach(alert => {
            alert.removeAttribute('aria-hidden');
            alert.inert = false;
          });
        }, 100);
      };
    }
  }, [isOpen]);

  return (
    <IonAlert
      ref={alertRef}
      isOpen={isOpen}
      onDidDismiss={onDidDismiss}
      {...props}
    />
  );
};

export default AccessibleAlert; 