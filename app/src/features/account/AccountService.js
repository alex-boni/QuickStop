import apiClient from "../../services/apiClient";

// Definición de Endpoints
const ACCOUNT_ENDPOINTS = {
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile'
};

// Servicio para obtener el perfil del usuario
export const getProfile = async () => {
    try {
        const response = await apiClient.get(ACCOUNT_ENDPOINTS.GET_PROFILE);
        return response.data;
    } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
            throw new Error('Unauthorized');
        }
        throw error;
    }
};

// Servicio para actualizar el perfil del usuario
export const updateProfile = async (profileData) => {
    try {
        const response = await apiClient.put(ACCOUNT_ENDPOINTS.UPDATE_PROFILE, profileData);
        return response.data;
    } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
            throw new Error('Unauthorized');
        } else if (status === 400) {
            throw new Error('InvalidData');
        }
        throw error;
    }
};
