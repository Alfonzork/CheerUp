import {
  IonPage,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonList,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPopover,
  IonHeader,
  IonButton,
  IonButtons,
  IonRange,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import AppHeader from './AppHeader';
import React, { useEffect, useState } from 'react';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { add, barbell, chevronUpCircle, colorPalette, globe, rocket, videocam } from 'ionicons/icons';
import AccessibleModal from './AccessibleModal';
import LoadingOverlay from './LoadingOverlay';
import { tutorialService } from '../services/tutorial.service';
import { Nivel } from '../models/supabase.model';
import { subscribeToChanges } from '../services/changes.service';
import { di } from '@fullcalendar/core/internal-common';

const TutorialPage: React.FC = () => {
    const [showModalNivel, setShowModalNivel] = useState(false);
    const [showModalEjercicio, setShowModalEjercicio] = useState(false);
    const [showModalVideo, setShowModalVideo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'warning' | 'danger' | undefined>(undefined);

    const [niveles, setNiveles] = useState<Nivel[]>([]);
    const [formNivel, setFormNivel] = useState({
        id: 0,
        name: '',
        description: ''
    });

    const [formExercise, setFormExercise] = useState({
        id: '', 
        name: '',
        description: '',
        difficulty_id: 0,
    });

    const [formVideo, setFormVideo] = useState({
        id: '',
        url: '',
        media_type: 'video', // 'video' o 'image'
        exercise_id: '', // ID del ejercicio al que pertenece el video
        position: 1, // Posición del video en la lista de ejercicios
    });

    const [selectedNivelId, setSelectedNivelId] = useState<number | null>(null);

    const loadPage = async () => {
        try {
            const data = await tutorialService.loadTutorial();
            if (data && Array.isArray(data)) {
                // Asegurarse de que cada nivel tenga un array de exercises
                const nivelesConEjercicios = data.map(nivel => ({
                    ...nivel,
                    exercises: nivel.exercises || []
                }));
                setNiveles(nivelesConEjercicios);
            } else {
                console.warn('Los datos recibidos no son un array:', data);
                setNiveles([]);
            }
        } catch (error) {
            console.error('Error al cargar los tutoriales:', error);
            setToastMessage('Error al cargar los tutoriales');
            setToastColor('danger');
            setShowToast(true);
            setNiveles([]);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let subscription: { unsubscribe: () => void } | null = null;

        const initializeData = async () => {
            if (isMounted) {
                try {
                    await loadPage();
                    
                    subscription = subscribeToChanges('tareas', (payload) => {
                        if (isMounted) {
                            console.log('Cambio detectado:', payload);
                            loadPage();
                        }
                    });
                } catch (error) {
                    console.error('Error en initializeData:', error);
                    if (isMounted) {
                        setToastMessage('Error al inicializar los datos');
                        setToastColor('danger');
                        setShowToast(true);
                    }
                }
            }
        };

        initializeData();

        return () => {
            isMounted = false;
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const abrirModalCrearNivel = () => {
 // Crea Nivel nuevo
        setShowModalNivel(true);
    };

    const abrirModalCrearVideo = () => {
 // Crea Video nuevo
        setShowModalVideo(true);
    };

    const abrirModalCrearEjercicio = () => {
        // Crea Ejercicio nuevo
        setShowModalEjercicio(true);
    };

    const handleSubmitNivel = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const nivelData = {
                name: formNivel.name.trim(),
                description: formNivel.description.trim()
            };
            
            if (formNivel.id) {
                const updatedNivel = await tutorialService.updateNivel(formNivel.id, nivelData);
                setToastMessage('Nivel actualizado correctamente');
                setToastColor('success');
            } else {
                const newNivel = await tutorialService.createNivel(nivelData);
                setToastMessage('Nivel creado correctamente');
                setToastColor('success');
                setNiveles(prev => [...prev, newNivel]);
            }
            setShowModalNivel(false);
            setFormNivel({
                id: 0,
                name: '',
                description: ''
            });
        } catch (error) {
            console.error('Error al guardar el nivel:', error);
            setToastMessage('Error al guardar el nivel');
            setToastColor('danger');
        } finally {
            setLoading(false);
            setShowToast(true);
        }
    };

    const handleSubmitExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formExercise.id) {
                await tutorialService.updateExercise(formExercise.id, formExercise);
                setToastMessage('Ejercicio actualizado correctamente');
                setToastColor('success');
            } else {
                await tutorialService.createExercise(formExercise);
                setToastMessage('Ejercicio creado correctamente');
                setToastColor('success');
            }
            setShowModalEjercicio(false);
            setFormExercise({
                id: '',
                name: '',
                description: '',
                difficulty_id: 0,
            });
            // Recargar los datos después de guardar
            await loadPage();
        }
        catch (error) {
            console.error('Error al guardar el ejercicio:', error);
            setToastMessage('Error al guardar el ejercicio');
            setToastColor('danger');
        } finally {
            setLoading(false);
            setShowToast(true);
        }
    };

    const handleSubmitVideo = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        console.log('Form Video:', formVideo);
        try {
            if (formVideo.id) {
                await tutorialService.updateExerciseMedia(formVideo.id, formVideo);
                setToastMessage('Video actualizado correctamente');
                setToastColor('success');
            } else {
                await tutorialService.createExerciseMedia(formVideo);
                setToastMessage('Video creado correctamente');
                setToastColor('success');
            }
            setShowModalVideo(false);
            setFormVideo({
                id: '',
                url: '',
                media_type: 'video',
                exercise_id: '', // ID del ejercicio al que pertenece el video
                position: 1, // Posición del video en la lista de ejercicios
            });
            // Recargar los datos después de guardar
            await loadPage();
        } catch (error) {
            console.error('Error al guardar el video:', error);  
            setToastMessage('Error al guardar el video');
            setToastColor('danger');
        } finally {
            setLoading(false);
            setShowToast(true);
        }
    };

    const getEjerciciosByNivel = (nivelId: number) => {
        const nivel = niveles.find(n => n.id === nivelId);
        return nivel?.exercises || [];
    };

  return (
    <IonPage>
      <AppHeader title="Tutoriales"/>
      <IonContent className="ion-padding">

    {niveles && niveles.length > 0 ? (
        niveles.map((nivel) => (
            <IonList key={nivel.id}>
                <IonLabel color="primary">
                    <h2>{nivel.name}</h2>
                    <p>{nivel.description}</p>
                </IonLabel>
                <IonAccordionGroup>
                    {nivel.exercises?.map((exercice) => (
                        <IonAccordion value={exercice.id} key={exercice.id}>
                            <IonItem slot="header">
                                <IonLabel>{exercice.name}<br/><small>{exercice.description}</small></IonLabel>
                            </IonItem>
                            <div slot="content">
                                {exercice.exercise_media?.map((video) => (
                                    <iframe key={video.id}
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${video.url}?modestbranding=1&rel=0`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    ></iframe>
                                ))}
                            </div>
                        </IonAccordion>
                    ))}
                </IonAccordionGroup>
            </IonList>
        ))
    ) : (
        <IonText color="medium" className="ion-text-center">
            <p>No hay tutoriales disponibles</p>
        </IonText>
    )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={chevronUpCircle}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton id='fab-nivel' onClick={abrirModalCrearNivel}>
              <IonIcon icon={rocket}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={abrirModalCrearVideo}>
              <IonIcon icon={barbell}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={abrirModalCrearVideo}>
              <IonIcon icon={videocam}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>

        <AccessibleModal 
          isOpen={showModalNivel} 
          onDidDismiss={() => setShowModalNivel(false)}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          aria-modal="true"
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Crear Niveles</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModalNivel(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmitNivel}>                
                <IonInput
                  label="Nombre"
                  labelPlacement="floating"
                  value={formNivel.name}
                  onIonChange={e => setFormNivel({...formNivel, name: e.detail.value!})}
                  required
                />
                <IonTextarea
                  label="Descripción"
                  labelPlacement="floating"
                  value={formNivel.description}
                  onIonInput={e => setFormNivel({...formNivel, description: e.detail.value!})}
                  rows={3}
                  autoGrow={true}
                  required
                />
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  Guardar
                </IonButton>
                </form>
            </IonContent>
        </AccessibleModal>

        <AccessibleModal 
          isOpen={showModalEjercicio} 
          onDidDismiss={() => setShowModalEjercicio(false)}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Crear Ejercicio</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModalEjercicio(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmitExercise}>                
                <IonInput
                  label="Nombre"
                  labelPlacement="floating"
                  value={formExercise.name}
                  onIonChange={e => setFormExercise({...formExercise, name: e.detail.value!})}
                />
                <IonTextarea
                  label="Descripción"
                  labelPlacement="floating"
                  value={formExercise.description}
                  onIonInput={e => setFormExercise({...formExercise, description: e.detail.value!})}
                  rows={3}
                />
                <IonSelect
                  label="Nivel"
                  labelPlacement="floating"
                  value={formExercise.difficulty_id}
                  onIonChange={e => setFormExercise({...formExercise, difficulty_id: e.detail.value!})}
                >
                    {niveles.map((nivel) => (
                    <IonSelectOption key={nivel.id} value={nivel.id}>
                      {nivel.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  Guardar
                </IonButton>
                </form>
            </IonContent>
        </AccessibleModal>

        <AccessibleModal 
          isOpen={showModalVideo} 
          onDidDismiss={() => {
            setShowModalVideo(false);
            setSelectedNivelId(null);
          }}
          breakpoints={[0, 0.8]}
          initialBreakpoint={0.8}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Crear Video</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => {
                    setShowModalVideo(false);
                    setSelectedNivelId(null);
                  }}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmitVideo}>
                <IonSelect
                  label="Nivel"
                  labelPlacement="floating"
                  value={selectedNivelId}
                  onIonChange={e => {
                    const nivelId = e.detail.value;
                    setSelectedNivelId(nivelId);
                    setFormExercise(prev => ({
                      ...prev,
                      difficulty_id: nivelId,
                      id: '' // Resetear el ejercicio seleccionado
                    }));
                  }}
                >
                    {niveles.map((nivel) => (
                    <IonSelectOption key={nivel.id} value={nivel.id}>
                      {nivel.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>

                <IonSelect
                  label="Ejercicio"
                  labelPlacement="floating"
                  value={formVideo.exercise_id}
                  onIonChange={e => setFormVideo(prev => ({
                    ...prev,
                    exercise_id: e.detail.value!
                  }))}
                  disabled={!selectedNivelId}
                >
                    {selectedNivelId && getEjerciciosByNivel(selectedNivelId).map((ejercicio) => (
                      <IonSelectOption key={ejercicio.id} value={ejercicio.id}>
                        {ejercicio.name}
                      </IonSelectOption>
                    ))}
                </IonSelect>

                <IonSelect
                  label="Tipo"
                  labelPlacement="floating"
                  value={formVideo.media_type}
                  onIonChange={e => setFormVideo(prev => ({
                    ...prev,
                    type: e.detail.value!
                  }))}
                >
                    <IonSelectOption value="video">Video</IonSelectOption>
                    <IonSelectOption value="image">Imagen</IonSelectOption>
                </IonSelect>

                <IonInput
                  label="Codigo del Video"
                  labelPlacement="floating"
                  value={formVideo.url}
                  onIonInput={e => setFormVideo(prev => ({
                    ...prev,
                    url: e.detail.value!
                  }))}                
                />                
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  Guardar
                </IonButton>
                </form>
            </IonContent>
        </AccessibleModal>

        <LoadingOverlay isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />

      </IonContent>
    </IonPage>
  );
};

export default TutorialPage;