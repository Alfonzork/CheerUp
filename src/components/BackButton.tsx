import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const BackButton: React.FC = () => {
  const history = useHistory();

  return (
    <IonButton fill="clear" onClick={() => history.goBack()} style={{ '--padding-start': '8px', '--padding-end': '8px' }}>
      <IonIcon icon={chevronBack} slot="icon-only" />
    </IonButton>
  );
};

export default BackButton;