import React, { useEffect, useRef } from 'react';
import { IonLoading } from '@ionic/react';

interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isOpen, message = 'Cargando...' }) => {
  const loadingRef = useRef<HTMLIonLoadingElement>(null);

  useEffect(() => {
    if (loadingRef.current) {
      const loadingElement = loadingRef.current;
      
      // Configurar MutationObserver para detectar cambios en los atributos
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            // Remover aria-hidden inmediatamente si se agrega
            loadingElement.removeAttribute('aria-hidden');
            // Agregar inert en su lugar
            loadingElement.setAttribute('inert', '');
          }
        });
      });

      // Observar cambios en los atributos
      observer.observe(loadingElement, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });

      if (isOpen) {
        // Asegurarse de que el elemento tenga inert y no aria-hidden
        loadingElement.setAttribute('inert', '');
        loadingElement.removeAttribute('aria-hidden');
      } else {
        loadingElement.removeAttribute('inert');
      }

      // Limpiar el observer cuando el componente se desmonte
      return () => {
        observer.disconnect();
      };
    }
  }, [isOpen]);

  return (
    <IonLoading
      ref={loadingRef}
      isOpen={isOpen}
      message={message}
      cssClass="loading-overlay"
      duration={0}
      spinner="circular"
      translucent={true}
      aria-live="polite"
      aria-label={message}
      role="alert"
    />
  );
};

export default LoadingOverlay; 