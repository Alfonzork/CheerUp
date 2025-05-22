import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAvatar,
  IonToast,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/react';
import { camera, save } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { supabase, SUPABASE_STORAGE_URL } from '../services/supabase.service';
import LoadingOverlay from '../components/LoadingOverlay';
import imageCompression from 'browser-image-compression';
import AppHeader from '../components/AppHeader';

interface PerfilData {
  id: string;
  run: string;
  nombres: string;
  ap_paterno: string;
  ap_materno: string;
  fecha_nacimiento: string;
  email: string;
  telefono: string;
  avatar?: string;
}

const PerfilUser: React.FC = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [limiteRegistros, setLimiteRegistros] = useState(20);

  useEffect(() => {
    cargarPerfil();
  }, [limiteRegistros]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .limit(limiteRegistros)
        .single();

      if (error) throw error;

      // Obtener la URL de la imagen del storage
      if (data.avatar) {
        data.avatar = `${SUPABASE_STORAGE_URL}/users/${data.avatar}`;
      }

      setPerfil(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setToastMessage('Error al cargar el perfil');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarImagen = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setLoading(true);
        try {
          const user = await AuthService.getCurrentUser();
          if (!user) throw new Error('Usuario no autenticado');

          // Opciones de compresión
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
          };

          // Comprimir la imagen
          const compressedFile = await imageCompression(file, options);
          console.log('Tamaño original:', file.size / 1024 / 1024, 'MB');
          console.log('Tamaño comprimido:', compressedFile.size / 1024 / 1024, 'MB');

          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Math.random()}.${fileExt}`;

          // Subir al bucket 'users'
          const { error: uploadError } = await supabase.storage
            .from('users')
            .upload(fileName, compressedFile);

          if (uploadError) throw uploadError;

          // Construir la URL completa usando SUPABASE_STORAGE_URL
          const imageUrl = `${SUPABASE_STORAGE_URL}/users/${fileName}`;

          // Actualizar el perfil con la nueva URL
          const { error: updateError } = await supabase
            .from('users')
            .update({ avatar: fileName })
            .eq('id', user.id);

          if (updateError) throw updateError;

          // Actualizar el estado local
          setPerfil(prev => {
            if (!prev) return null;
            const updatedPerfil = { ...prev, avatar: imageUrl };
            
            // Actualizar localStorage con los nuevos datos
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            userData.avatar = imageUrl;
            localStorage.setItem('user', JSON.stringify(userData));
            
            return updatedPerfil;
          });

          setToastMessage('Imagen actualizada correctamente');
          setShowToast(true);
        } finally {
          setLoading(false);
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al cambiar imagen:', error);
      setToastMessage('Error al cambiar la imagen');
      setShowToast(true);
    }
  };

  const handleCambiarPassword = async () => {
    try {
      if (nuevaPassword !== confirmarPassword) {
        setToastMessage('Las contraseñas no coinciden');
        setShowToast(true);
        return;
      }

      const user = await AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase.auth.updateUser({
        password: nuevaPassword
      });

      if (error) throw error;

      setNuevaPassword('');
      setConfirmarPassword('');
      setToastMessage('Contraseña actualizada correctamente');
      setShowToast(true);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setToastMessage('Error al cambiar la contraseña');
      setShowToast(true);
    }
  };

  if (!perfil) return null;

  return (
    <IonPage>
      <AppHeader title="Mi Perfil" />
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonCard>
                <IonCardHeader>
                  <div className="ion-text-center">
                    <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                      <img src={perfil.avatar || '/default-avatar.png'} alt="Avatar" />
                    </IonAvatar>
                    <IonButton  onClick={handleCambiarImagen}>
                      <IonIcon icon={camera} slot="start" />
                      Cambiar Imagen
                    </IonButton>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position="stacked">R.U.N.</IonLabel>
                      <IonText>{perfil.run}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Nombres</IonLabel>
                      <IonText>{perfil.nombres}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Apellido Paterno</IonLabel>
                      <IonText>{perfil.ap_paterno}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Apellido Materno</IonLabel>
                      <IonText>{perfil.ap_materno}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Fecha de Nacimiento</IonLabel>
                      <IonText>
                        {perfil.fecha_nacimiento
                          ? new Date(perfil.fecha_nacimiento).toLocaleDateString()
                          : ''}
                      </IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Email</IonLabel>
                      <IonText>{perfil.email}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Teléfono</IonLabel>
                      <IonText>{perfil.telefono}</IonText>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>

              <IonCard className="ion-margin-top">
                <IonCardHeader>
                  <IonCardTitle>Cambiar PIN</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonInput
                      label='Nuevo PIN'
                      labelPlacement='floating'
                      type="password"
                      value={nuevaPassword}
                      onIonInput={e => {
                        const value = e.detail.value || '';
                        if (value.length <= 4 && /^\d*$/.test(value)) {
                          setNuevaPassword(value);
                        }
                      }}
                      maxlength={4}
                      placeholder="Ingrese PIN de 4 dígitos"
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      label='Confirmar PIN'
                      labelPlacement='floating'
                      type="password"
                      value={confirmarPassword}
                      onIonInput={e => {
                        const value = e.detail.value || '';
                        if (value.length <= 4 && /^\d*$/.test(value)) {
                          setConfirmarPassword(value);
                        }
                      }}
                      maxlength={4}
                      placeholder="Confirme PIN de 4 dígitos"
                    />
                  </IonItem>
                  <IonButton expand="block" onClick={handleCambiarPassword}>
                    <IonIcon icon={save} slot="start" />
                    Cambiar PIN
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default PerfilUser;