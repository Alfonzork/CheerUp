import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
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
import LoadingOverlay from '../../components/LoadingOverlay';

interface User {
  id: string;
  run: string;
  password: string;
  tipo_usuario: 'admin' | 'entrenador' | 'deportista';
}

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
          history.replace(`/${userData.tipo_usuario}/dashboard`);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        localStorage.removeItem('user');
      }
    }
  }, [history]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!run || !password) {
      setToastMessage('Por favor, ingrese R.U.N. y contraseña');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('run', run)
        .eq('password', password)
        .maybeSingle() as { data: User | null, error: any };

      if (error) {
        console.error('Error en la consulta:', error);
        setToastMessage('Error al iniciar sesión. Por favor, intenta nuevamente.');
        setShowToast(true);
        return;
      }

      if (!data) {
        setToastMessage('Usuario no encontrado y/o contraseña incorrecta');
        setShowToast(true);
        return;
      }

      // Si llegamos aquí, el login es exitoso
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirigir según el rol
      switch (data.tipo_usuario) {
        case 'admin':
          history.push('/admin/dashboard');
          break;
        case 'entrenador':
          history.replace('/entrenador/dashboard');
          break;
        case 'deportista':
          history.push('/deportista/dashboard');
          break;
        default:
          setToastMessage('Tipo de usuario no válido');
          setShowToast(true);
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
                      label="PIN"
                      labelPlacement="floating"
                      value={password}
                      onIonInput={e => {
                        const value = e.detail.value || '';
                        if (value.length <= 4 && /^\d*$/.test(value)) {
                          setPassword(value);
                        }
                      }}
                      maxlength={4}
                      required
                      className="ion-margin-bottom"
                      placeholder="Ingrese su PIN de 4 dígitos"
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

        <LoadingOverlay isOpen={loading} message="Iniciando sesión..." />
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