import React from 'react';
import { IonPage } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import PerfilUser from '../../components/PerfilUser';

const EntrenadorPerfilPage: React.FC = () => {
  return (
    <IonPage>
      <AppHeader title="Mi Perfil" />
      <PerfilUser />
    </IonPage>
  );
};

export default EntrenadorPerfilPage; 