import { timeOutline, checkmarkCircleOutline } from 'ionicons/icons';

const tareaHelper = {
    getEstadoColor(estado: number) {
        switch (estado) {
            case 1:
                return 'warning';
            case 2:
                return 'primary';
            case 3:
                return 'success';
            case 4:
                return 'success';
            default:
                return 'medium';
        }
    },

    getEstadoTexto(estado: number) {
        switch (estado) {
            case 1:
                return 'Pendiente';
            case 2:
                return 'En Progreso';
            case 3:
                return 'Completado';
            case 4:
                return 'Evaluado';
            default:
                return estado;
        }
    },

    getEstadoIcono(estado: number) {
        switch (estado) {
            case 1:
                return timeOutline;
            case 3:
                return checkmarkCircleOutline;
            case 4:
                return checkmarkCircleOutline;
            default:
                return timeOutline;
        }
    },
}

export default tareaHelper;