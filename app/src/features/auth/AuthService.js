import apiClient from "../../services/apiClient";

//Definicion de Endpoints
const AUTH_ENDPOINTS = {
    REGISTER: '/auth/register'
    //Soto aqui se pueden añadir mas endpoints como LOGIN, LOGOUT, etc. Esto estara en todos nuestros servicios. Tendra la misma estructura
}

//Servicios de Autenticacion

//Servicio de Registro de Usuario
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
        return response.data;
    } catch (error) {
        // Manejo de errores específicos (ej. 409 Conflict: Email ya existe)
        if (error.response?.status === 409) {
            throw new Error('EmailAlreadyExists'); 
        }
        throw error;
    }
};


//Aqui se pueden definir mas servicios como loginUser, logoutUser, etc. Para luego exportarlos y usarlos en los componentes correspondientes.