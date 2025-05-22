import {
  IonPage,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import { useEffect, useState } from 'react';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { supabase } from '../../services/supabase.service';

const DeportistaTutorialPage: React.FC = () => {
type Video = {
  id: number;
  url: string;
  [key: string]: any;
};

const [videos, setVideos] = useState<Video[]>([]);

 useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from('exercise_view').select('*');
      if (!error) setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <IonPage>
      <AppHeader title="Tutoriales"/>
      <IonContent className="ion-padding">

        {/* Nivel 1 */}
        <IonList>
          <IonLabel color="primary"><h2>Nivel 1</h2></IonLabel>
          <IonAccordionGroup>
            {videos.map((video) => (
            <IonAccordion value={video.exercise_id} key={video.id}>
              <IonItem slot="header">
                <IonLabel>{video.name}</IonLabel>
              </IonItem>
              <div slot="content">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.url}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                ></iframe>
                </div>
            </IonAccordion>
            ))}
          </IonAccordionGroup>
        </IonList>

        {/* Nivel 2 */}
        <IonList>
          <IonLabel color="primary"><h2>Nivel 2</h2></IonLabel>
          <IonAccordionGroup>
            <IonAccordion value="n2-1">
              <IonItem slot="header">
                <IonLabel>¿Cómo ver mis tareas?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                En el menú principal selecciona "Tareas"...
              </div>
            </IonAccordion>
            <IonAccordion value="n2-2">
              <IonItem slot="header">
                <IonLabel>¿Cómo entregar una tarea?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Para entregar una tarea debes...
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonList>

        {/* Nivel 3 */}
        <IonList>
          <IonLabel color="primary"><h2>Nivel 3</h2></IonLabel>
          <IonAccordionGroup>
            <IonAccordion value="n3-1">
              <IonItem slot="header">
                <IonLabel>¿Cómo ver mis estadísticas?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Ingresa a la sección "Estadísticas"...
              </div>
            </IonAccordion>
            <IonAccordion value="n3-2">
              <IonItem slot="header">
                <IonLabel>¿Cómo contactar a mi entrenador?</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Puedes contactar a tu entrenador desde...
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default DeportistaTutorialPage;