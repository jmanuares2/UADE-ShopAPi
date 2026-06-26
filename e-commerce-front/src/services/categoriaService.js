import api from './api';

export const categoriaService = {
  getAllCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener categorías');
    }
  },

  createCategoria: async (data) => {
    try {
      const response = await api.post('/categorias', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear categoría');
    }
  },

  updateCategoria: async (id, data) => {
    try {
      const response = await api.put(`/categorias/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar categoría');
    }
  },

  deleteCategoria: async (id, reemplazoId = null) => {
    try {
      let url = `/categorias/${id}`;
      if (reemplazoId) {
        url += `?reemplazoId=${reemplazoId}`;
      }
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar categoría');
    }
  }
};
