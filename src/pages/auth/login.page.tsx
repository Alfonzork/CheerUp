import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLoading,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './login.page.css';
import { supabase } from '../../services/supabase.service';

const Login: React.FC = () => {
  const [run, setRun] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.tipo_usuario) {
          history.push(`/${userData.tipo_usuario}/dashboard`);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        localStorage.removeItem('user');
      }
    }
  }, [history]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('run', run)
        .eq('password', password)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setToastMessage('Credenciales inválidas. Por favor, verifica tu R.U.N. y contraseña.');
        } else {
          setToastMessage('Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
        setShowToast(true);
        return;
      }

      if (data) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data));
        
        // Redirigir según el rol
        switch (data.tipo_usuario) {
          case 'admin':
            history.push('/admin/dashboard');
            break;
          case 'entrenador':
            history.push('/entrenador/dashboard');
            break;
          case 'deportista':
            history.push('/deportista/dashboard');
            break;
          default:
            setToastMessage('Tipo de usuario no válido');
            setShowToast(true);
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setToastMessage('Error al iniciar sesión. Por favor, intenta nuevamente.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div className="ion-text-center ion-padding">
                <IonImg 
                  src="/icon.png" 
                  alt="Logo"
                  style={{ maxWidth: '200px', margin: '2rem auto' }}
                />
              </div>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center">Iniciar Sesión</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleLogin}>
                    <IonInput
                      label="R.U.N."
                      labelPlacement="floating"
                      value={run}
                      onIonChange={e => setRun(e.detail.value!)}
                      required
                      className="ion-margin-bottom"
                      placeholder="Ingrese su R.U.N."
                    />
                    <IonInput
                      type="password"
                      label="Contraseña"
                      labelPlacement="floating"
                      value={password}
                      onIonChange={e => setPassword(e.detail.value!)}
                      required
                      className="ion-margin-bottom"
                      placeholder="Ingrese su contraseña"
                    />
                    <IonButton expand="block" type="submit" className="ion-margin-top">
                      Ingresar
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading isOpen={loading} message="Iniciando sesión..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login; 