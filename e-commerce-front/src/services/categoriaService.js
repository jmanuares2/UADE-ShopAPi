import { API_URL, authHeaders } from './api';

export const categoriaService = {
  getAllCategorias: async () => {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return response.json();
  },

  createCategoria: async (data) => {
    const response = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error al crear categoría');
    }
    return response.json();
  },

  updateCategoria: async (id, data) => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error al actualizar categoría');
    }
    return response.json();
  },

  deleteCategoria: async (id) => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar categoría');
  },
};
