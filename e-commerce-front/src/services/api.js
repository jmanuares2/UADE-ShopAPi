import axios from 'axios';

export const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial para enviar y recibir cookies (JWT y XSRF)
  withXSRFToken: true,   // NATIVO de Axios >=1.6: Habilita el XSRF token en peticiones cross-origin
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función mock deprecated por compatibilidad si es que queda algo usándolo
export const authHeaders = () => {
  return {};
};

export default api;
