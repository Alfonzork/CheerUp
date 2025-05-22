import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButtons,
  IonToast,
  IonSearchbar,
  IonTextarea,
  IonInput
} from '@ionic/react';
import { add, time, location } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { eventoService } from '../../services/eventos.service';
import { Evento } from '../../models/supabase.model';
import LoadingOverlay from '../../components/LoadingOverlay';
import AccessibleModal from '../../components/AccessibleModal';
import Calendario from '../../components/Calendario';
import AppHeader from '../../components/AppHeader';

const CalendarioDeportista: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchText, setSearchText] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const eventosData = await eventoService.getAll();
      setEventos(eventosData);
    } catch (error) {
      setToastMessage('Error al cargar los datos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eventosFiltrados = eventos.filter(evento => {
    const searchLower = searchText.toLowerCase();
    const titulo = evento.titulo?.toLowerCase() || '';
    const descripcion = evento.descripcion?.toLowerCase() || '';
    const ubicacion = evento.ubicacion?.toLowerCase() || '';
    return titulo.includes(searchLower) || 
           descripcion.includes(searchLower) || 
           ubicacion.includes(searchLower);
  });

  const eventosPasados = eventosFiltrados.filter(evento => 
    new Date(evento.fecha_inicio) < new Date()
  );

  const eventosProximos = eventosFiltrados.filter(evento => 
    new Date(evento.fecha_inicio) >= new Date()
  );

  return (
    <IonPage>
      <AppHeader title="Calendario" />
      <Calendario />
    </IonPage>
  );
};

export default CalendarioDeportista; 