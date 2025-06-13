export const formatoFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00'); // Forzar la hora inicial para evitar desfase
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatoFechaHora = (datetime: string): string => {
  const date = new Date(datetime);
  const offsetMs = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
