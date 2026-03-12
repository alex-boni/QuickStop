import apiClient from "../../services/apiClient";

const RESERVATION_ENDPOINTS = {
    GET_RESERVATIONS_BY_USER: '/reservation/user',
    GET_RESERVATIONS_BY_PARKING: '/reservation/parking',
    CREATE_RESERVATION: '/reservation/create',
    CANCEL_RESERVATION: '/reservation/cancel'
};

/**
 * Crea una nueva reserva en el sistema.
 * @param {Object} reservationData - (parkingId, userId, startTime, endTime, totalPrice)
 */
export const createReservation = async (reservationData) => {
    try {        
        const response = await apiClient.post(RESERVATION_ENDPOINTS.CREATE_RESERVATION, reservationData);
        return response.data;
    } catch (error) {
        console.error("Error al crear reserva:", error);
        throw error;
    }
};

/**
 * Obtiene el historial de reservas del usuario autenticado.
 */
export const getUserReservations = async (userId) => {
    try {
        const response = await apiClient.get(`${RESERVATION_ENDPOINTS.GET_RESERVATIONS_BY_USER}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        throw error;
    }
};

/**
 * Obtiene las reservas activas para un parking específico.
 * @param {number} parkingId
 */
export const getReservationsByParking = async (parkingId) => {
    try {
        const response = await apiClient.get(`${RESERVATION_ENDPOINTS.GET_RESERVATIONS_BY_PARKING}/${parkingId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener reservas por parking:", error);
        throw error;
    }
}

/**
 * Cancela una reserva activa.
 * @param {number} reservationId
 */
export const cancelReservation = async (reservationId) => {
    try {
        const response = await apiClient.put(`${RESERVATION_ENDPOINTS.CANCEL_RESERVATION}/${reservationId}`);
        return response.data;
    } catch (error) {
        console.error("Error al cancelar reserva:", error);
        throw error;
    }
};