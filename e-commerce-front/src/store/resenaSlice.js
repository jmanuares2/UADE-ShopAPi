import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Trae la lista de reseñas de un producto puntual.
export const fetchResenas = createAsyncThunk(
  'resenas/fetchResenas',
  async (productoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resenas/producto/${productoId}`);
      return { productoId, resenas: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener las reseñas');
    }
  }
);

// Trae el promedio de estrellas y la cantidad de reseñas de un producto.
export const fetchResumenResenas = createAsyncThunk(
  'resenas/fetchResumenResenas',
  async (productoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resenas/producto/${productoId}/resumen`);
      return { productoId, resumen: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el resumen');
    }
  }
);

// Crea o actualiza (upsert) la reseña del usuario logueado para un producto.
export const guardarResena = createAsyncThunk(
  'resenas/guardarResena',
  async ({ productoId, puntuacion, comentario }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/resenas/${productoId}`, { puntuacion, comentario });
      return { productoId, resena: response.data };
    } catch (error) {
      const mensajeError = error.response?.data?.message ||
                           (typeof error.response?.data === 'string' ? error.response.data : null) ||
                           'Error al guardar la reseña';
      return rejectWithValue(mensajeError);
    }
  }
);

// Elimina una reseña por id.
export const eliminarResena = createAsyncThunk(
  'resenas/eliminarResena',
  async ({ productoId, resenaId }, { rejectWithValue }) => {
    try {
      await api.delete(`/resenas/${resenaId}`);
      return { productoId, resenaId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar la reseña');
    }
  }
);

const resenasSlice = createSlice({
  name: 'resenas',
  initialState: {
    porProducto: {}, // { [productoId]: { items: [], resumen: { promedio, cantidad }, loading, error } }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResenas.pending, (state, action) => {
        const productoId = action.meta.arg;
        state.porProducto[productoId] = state.porProducto[productoId] || { items: [], resumen: null };
        state.porProducto[productoId].loading = true;
      })
      .addCase(fetchResenas.fulfilled, (state, action) => {
        const { productoId, resenas } = action.payload;
        state.porProducto[productoId] = state.porProducto[productoId] || { items: [], resumen: null };
        state.porProducto[productoId].items = resenas;
        state.porProducto[productoId].loading = false;
      })
      .addCase(fetchResenas.rejected, (state, action) => {
        const productoId = action.meta.arg;
        if (state.porProducto[productoId]) {
          state.porProducto[productoId].loading = false;
          state.porProducto[productoId].error = action.payload;
        }
      })
      .addCase(fetchResumenResenas.fulfilled, (state, action) => {
        const { productoId, resumen } = action.payload;
        state.porProducto[productoId] = state.porProducto[productoId] || { items: [], resumen: null };
        state.porProducto[productoId].resumen = resumen;
      })
      .addCase(guardarResena.fulfilled, (state, action) => {
        const { productoId, resena } = action.payload;
        const entry = state.porProducto[productoId] || { items: [], resumen: null };
        const idx = entry.items.findIndex((r) => r.usuarioId === resena.usuarioId);
        if (idx >= 0) {
          entry.items[idx] = resena;
        } else {
          entry.items.unshift(resena);
        }
        state.porProducto[productoId] = entry;
      })
      .addCase(eliminarResena.fulfilled, (state, action) => {
        const { productoId, resenaId } = action.payload;
        const entry = state.porProducto[productoId];
        if (entry) {
          entry.items = entry.items.filter((r) => r.id !== resenaId);
        }
      });
  },
});

export default resenasSlice.reducer;