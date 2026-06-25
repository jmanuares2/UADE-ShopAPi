import { API_URL, authHeaders } from './api';

export const usuarioService = {
  getAllUsuarios: async () => {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  updateUsuario: async (id, data) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error al actualizar usuario');
    }
    return response.json();
  },

  deleteUsuario: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Error al deshabilitar usuario');
  },

  restoreUsuario: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}/restaurar`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Error al restaurar usuario');
    return response.json();
  },

  hardDeleteUsuario: async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}/definitivo`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al eliminar definitivamente el usuario. Asegúrese de que no tenga productos publicados.');
    }
  },
};
