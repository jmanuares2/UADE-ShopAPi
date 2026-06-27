import api from './api';

const getErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  return (typeof data === 'string' ? data : data?.message) || fallback;
};

export const categoriaService = {
  getAllCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Error al obtener categorias'));
    }
  },

  createCategoria: async (data) => {
    try {
      const response = await api.post('/categorias', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Error al crear categoria'));
    }
  },

  updateCategoria: async (id, data) => {
    try {
      const response = await api.put(`/categorias/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Error al actualizar categoria'));
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
      throw new Error(getErrorMessage(error, 'Error al eliminar categoria'));
    }
  }
};
