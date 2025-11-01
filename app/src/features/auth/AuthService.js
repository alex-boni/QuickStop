import apiClient from "../../services/apiClient";

//Definicion de Endpoints
const AUTH_ENDPOINTS = {
    REGISTER: '/auth/register'
    , LOGIN: '/auth/login'
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


// Servicio de Login de Usuario
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
        const data = response.data;
        // Si la API devuelve un token, lo guardamos para futuras peticiones
        if (data?.token) {
            localStorage.setItem('authToken', data.token);
        }
        return data;
    } catch (error) {
        // Mapear errores para el frontend
        const status = error.response?.status;
        if (status === 401 || status === 400 || status === 403) {
            throw new Error('InvalidCredentials');
        }
        throw error;
    }
};

// Servicio de Logout de Usuario
export const logoutUser = () => {
    // Limpiar tokens y datos del usuario
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
};

//Aqui se pueden definir mas servicios como logoutUser, etc. Para luego exportarlos y usarlos en los componentes correspondientes.