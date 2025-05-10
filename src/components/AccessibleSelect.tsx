import React, { useEffect, useRef } from 'react';
import { IonSelect } from '@ionic/react';

interface AccessibleSelectProps {
  value?: any;
  onIonChange?: (event: any) => void;
  label?: string;
  labelPlacement?: 'floating' | 'stacked' | 'fixed';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

const AccessibleSelect: React.FC<AccessibleSelectProps> = ({ value, onIonChange, ...props }) => {
  const selectRef = useRef<HTMLIonSelectElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      const selectElement = selectRef.current;
      
      // Remover aria-hidden y usar inert
      selectElement.removeAttribute('aria-hidden');
      selectElement.inert = false;

      // Observar cambios en aria-hidden
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'aria-hidden') {
            selectElement.removeAttribute('aria-hidden');
            selectElement.inert = false;
          }
        });
      });

      observer.observe(selectElement, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });

      // Observar el popover del select
      const popoverObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement && node.tagName === 'ION-POPOVER') {
                node.removeAttribute('aria-hidden');
                node.inert = false;
              }
            });
          }
        });
      });

      // Observar el documento para detectar cuando se abre el popover
      popoverObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => {
        observer.disconnect();
        popoverObserver.disconnect();
        // Limpiar al cerrar
        setTimeout(() => {
          const selects = document.querySelectorAll('ion-select');
          const popovers = document.querySelectorAll('ion-popover');
          selects.forEach(select => {
            select.removeAttribute('aria-hidden');
            select.inert = false;
          });
          popovers.forEach(popover => {
            popover.removeAttribute('aria-hidden');
            popover.inert = false;
          });
        }, 100);
      };
    }
  }, []);

  return (
    <IonSelect
      ref={selectRef}
      value={value}
      onIonChange={onIonChange}
      {...props}
    />
  );
};

export default AccessibleSelect; 