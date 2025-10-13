// app/src/services/apiClient.js

import axios from 'axios';

/**
 * 💡 Configuración Central de Axios para QuickStop / ParkIT.
 * * Utiliza la base URL '/api' que debe ser redirigida por el proxy de Vite
 * a http://localhost:8080 (Spring Boot) en entorno de desarrollo.
 */
const apiClient = axios.create({
  // Base URL para todas las peticiones. 
  // En dev, Vite proxy redirige /api/* a Spring Boot.
  // En prod, Spring Boot servirá los assets y manejará /api.
  baseURL: '/api', 
  
  // Define que siempre enviamos y esperamos JSON.
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Define un timeout para peticiones largas (opcional pero recomendado)
  timeout: 10000, 
});

// ----------------------------------------------------------------------
// Interceptores: Gestión de Tokens y Errores Globales (WCAG 3.3.4)
// ----------------------------------------------------------------------

// Interceptor de Petición: Añadir el token de autenticación (JWT) si existe
apiClient.interceptors.request.use(
  (config) => {
    // Recupera el token del almacenamiento local (simulación de Auth)
    const token = localStorage.getItem('authToken'); 
    
    if (token) {
      // Añade el token en el formato estándar (Bearer Token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta: Manejo centralizado de errores de la API
apiClient.interceptors.response.use(
  (response) => {
    // Petición exitosa (2xx)
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    
    // WCAG 3.3.4: Manejo de errores de autenticación o servidor
    if (status === 401) {
      // Si no autorizado, redirigir al login y limpiar el token
      console.error("Error 401: No autorizado. Redirigiendo a Login...");
      localStorage.removeItem('authToken');
      // window.location.href = '/login'; // Descomentar al tener el router completo
    } else if (status === 500) {
        // Error de servidor: Se puede mostrar un mensaje global genérico
        console.error("Error 500: Fallo interno del servidor. Por favor, inténtelo más tarde.");
    }
    
    // Rechaza la promesa para que el componente que llama pueda manejar errores específicos (ej. email ya existe)
    return Promise.reject(error);
  }
);

export default apiClient;