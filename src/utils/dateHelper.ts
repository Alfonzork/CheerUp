export const formatoFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00'); // Forzar la hora inicial para evitar desfase
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
