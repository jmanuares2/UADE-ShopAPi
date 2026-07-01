import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authSlice';

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

// Si se vence la cookie desloguea automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export const authHeaders = () => {
  return {};
};

export default api;
