import apiClient from '../../services/apiClient';

const USER_ENDPOINTS = {
  ME: '/users/me',
};

export const getCurrentUser = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.ME);
  return response.data;
};

export const updateCurrentUser = async (payload) => {
  const response = await apiClient.put(USER_ENDPOINTS.ME, payload);
  return response.data;
};

