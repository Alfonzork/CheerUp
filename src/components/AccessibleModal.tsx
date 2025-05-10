import React, { useEffect } from 'react';
import { IonModal } from '@ionic/react';

interface AccessibleModalProps {
  isOpen: boolean;
  onDidDismiss?: () => void;
  children: React.ReactNode;
  [key: string]: any;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({ isOpen, onDidDismiss, children, ...props }) => {
  useEffect(() => {
    let observers: MutationObserver[] = [];
    let modals: Element[] = [];

    if (isOpen) {
      modals = Array.from(document.querySelectorAll('ion-modal'));
      modals.forEach((modal) => {
        modal.removeAttribute('aria-hidden');
        (modal as HTMLElement).inert = false;

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
              modal.removeAttribute('aria-hidden');
              (modal as HTMLElement).inert = false;
            }
          });
        });
        observer.observe(modal, {
          attributes: true,
          attributeFilter: ['aria-hidden']
        });
        observers.push(observer);
      });
    }

    return () => {
      setTimeout(() => {
        modals.forEach((modal) => {
          modal.removeAttribute('aria-hidden');
          (modal as HTMLElement).inert = false;
        });
        observers.forEach((observer) => observer.disconnect());
      }, 100);
    };
  }, [isOpen]);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDidDismiss}
      {...props}
    >
      {children}
    </IonModal>
  );
};

export default AccessibleModal; 