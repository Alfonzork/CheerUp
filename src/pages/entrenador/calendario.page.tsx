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
    IonModal,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonToast,
    IonDatetime,
    IonChip,
    IonSearchbar,
    IonTextarea,
    IonSegment,
    IonSegmentButton
  } from '@ionic/react';
  import { add, create, trash, calendar, time, location } from 'ionicons/icons';
  import React, { useEffect, useState } from 'react';
  import { eventoService } from '../../services/eventos.service';
  import { Evento } from '../../models/supabase.model';
  import FullCalendar from '@fullcalendar/react';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import esLocale from '@fullcalendar/core/locales/es';
  import './calendario.compacto.css';
  import LoadingOverlay from '../../components/LoadingOverlay';
  import AccessibleModal from '../../components/AccessibleModal';
  
  const Calendario: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
    const [searchText, setSearchText] = useState('');
    const [view, setView] = useState('calendar');
    const [formData, setFormData] = useState({
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipo: 'entrenamiento' as 'entrenamiento' | 'presentacion' | 'evento',
      ubicacion: '',
    });
  
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const eventosData = await eventoService.getAll();
        setEventos(eventosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setToastMessage('Error al cargar los datos');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      cargarDatos();
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (eventoEditar) {
          await eventoService.update(eventoEditar.id, formData);
          setToastMessage('Evento actualizado correctamente');
        } else {
          await eventoService.create(formData);
          setToastMessage('Evento creado correctamente');
        }
        setShowModal(false);
        cargarDatos();
      } catch (error) {
        console.error('Error al guardar evento:', error);
        setToastMessage('Error al guardar el evento');
      } finally {
        setLoading(false);
        setShowToast(true);
      }
    };
  
    const handleDelete = async (id: number) => {
      setLoading(true);
      try {
        await eventoService.delete(id);
        setToastMessage('Evento eliminado correctamente');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        setToastMessage('Error al eliminar el evento');
      } finally {
        setLoading(false);
        setShowToast(true);
      }
    };
  
    const abrirModalEditar = (evento: Evento) => {
      setEventoEditar(evento);
      setFormData({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        fecha_inicio: evento.fecha_inicio,
        fecha_fin: evento.fecha_fin,
        tipo: evento.tipo,
        ubicacion: evento.ubicacion
      });
      setShowModal(true);
    };
  
    const abrirModalCrear = () => {
      setEventoEditar(null);
      setFormData({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        tipo: 'entrenamiento',
        ubicacion: ''
      });
      setShowModal(true);
    };
  
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
  
    const calendarEvents = eventos.map(evento => ({
      id: evento.id.toString(),
      title: evento.titulo,
      start: evento.fecha_inicio,
      end: evento.fecha_fin,
      description: evento.descripcion,
      ubicacion: evento.ubicacion,
      backgroundColor: evento.tipo === 'entrenamiento' ? '#3880ff' : 
                      evento.tipo === 'presentacion' ? '#2dd36f' : '#ff4961'
    }));
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Calendario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ height: '350px' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              locale={esLocale}
              events={calendarEvents}
              eventClick={(info) => {
                const evento = eventos.find(e => e.id.toString() === info.event.id);
                if (evento) {
                  abrirModalEditar(evento);
                }
              }}
              dateClick={(info) => {
                setFormData({
                  ...formData,
                  fecha_inicio: info.dateStr + 'T00:00',
                  fecha_fin: info.dateStr + 'T23:59'
                });
                abrirModalCrear();
              }}
              height="100%"
              contentHeight={320}
            />
          </div>
  
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar eventos..."
          />
  
          <h5>Próximos Eventos</h5>
          <IonList>
            {eventosProximos.map((evento) => (
              <IonItem key={evento.id}>
                <IonLabel>
                  <h2>{evento.titulo}</h2>
                  <p>{evento.descripcion}</p>
                  <p>
                    <IonIcon icon={time} /> {new Date(evento.fecha_inicio).toLocaleString()}
                  </p>
                  <p>
                    <IonIcon icon={location} /> {evento.ubicacion}
                  </p>
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton onClick={() => abrirModalEditar(evento)}>
                    <IonIcon icon={create} />
                  </IonButton>
                  <IonButton onClick={() => handleDelete(evento.id)}>
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>
  
          <h5>Eventos Pasados</h5>
          <IonList>
            {eventosPasados.map((evento) => (
              <IonItem key={evento.id}>
                <IonLabel>
                  <h2>{evento.titulo}</h2>
                  <p>{evento.descripcion}</p>
                  <p>
                    <IonIcon icon={time} /> {new Date(evento.fecha_inicio).toLocaleString()}
                  </p>
                  <p>
                    <IonIcon icon={location} /> {evento.ubicacion}
                  </p>
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton onClick={() => abrirModalEditar(evento)}>
                    <IonIcon icon={create} />
                  </IonButton>
                  <IonButton onClick={() => handleDelete(evento.id)}>
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonButtons>
              </IonItem>
            ))}
          </IonList>
  
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={abrirModalCrear} color="warning">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
  
          <AccessibleModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{eventoEditar ? 'Editar Evento' : 'Nuevo Evento'}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleSubmit}>
                <IonInput
                  label="Título"
                  labelPlacement="floating"
                  value={formData.titulo}
                  onIonChange={e => setFormData({...formData, titulo: e.detail.value!})}
                  required
                />
                <IonTextarea
                  label="Descripción"
                  labelPlacement="floating"
                  value={formData.descripcion}
                  onIonChange={e => setFormData({...formData, descripcion: e.detail.value!})}
                  rows={4}
                />
                <IonInput
                  type="datetime-local"
                  label="Fecha"
                  labelPlacement="floating"
                  value={formData.fecha_inicio}
                  onIonChange={e => setFormData({...formData, fecha_inicio: e.detail.value!})}
                  required
                />
                <IonInput
                  type="datetime-local"
                  label="Fecha Fin"
                  labelPlacement="floating"
                  value={formData.fecha_fin}
                  onIonChange={e => setFormData({...formData, fecha_fin: e.detail.value!})}
                  required
                />
                <IonInput
                  label="Ubicación"
                  labelPlacement="floating"
                  value={formData.ubicacion}
                  onIonChange={e => setFormData({...formData, ubicacion: e.detail.value!})}
                  required
                />
                <IonButton expand="block" type="submit" className="ion-margin-top">
                  {eventoEditar ? 'Actualizar' : 'Crear'}
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
          />
        </IonContent>
      </IonPage>
    );
  };
  
  export default Calendario; 