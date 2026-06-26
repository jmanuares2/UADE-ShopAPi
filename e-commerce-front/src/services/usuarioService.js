import api from './api';

export const usuarioService = {
  getAllUsuarios: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  updateUsuario: async (id, data) => {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  deleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al deshabilitar usuario');
    }
  },

  restoreUsuario: async (id) => {
    try {
      const response = await api.patch(`/usuarios/${id}/restaurar`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al restaurar usuario');
    }
  },

  hardDeleteUsuario: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}/definitivo`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar definitivamente el usuario. Asegúrese de que no tenga productos publicados.');
    }
  },
};
