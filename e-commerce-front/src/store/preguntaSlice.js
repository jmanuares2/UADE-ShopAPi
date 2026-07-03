import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchPreguntas = createAsyncThunk(
  'preguntas/fetchPreguntas',
  async (productoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/preguntas/producto/${productoId}`);
      return { productoId, preguntas: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener las preguntas');
    }
  }
);

export const crearPregunta = createAsyncThunk(
  'preguntas/crearPregunta',
  async ({ productoId, texto }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/preguntas/${productoId}`, { texto });
      return { productoId, pregunta: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al enviar la pregunta');
    }
  }
);

export const responderPregunta = createAsyncThunk(
  'preguntas/responderPregunta',
  async ({ productoId, preguntaId, respuesta }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/preguntas/${preguntaId}/responder`, { respuesta });
      return { productoId, pregunta: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al responder la pregunta');
    }
  }
);

export const eliminarPregunta = createAsyncThunk(
  'preguntas/eliminarPregunta',
  async ({ productoId, preguntaId }, { rejectWithValue }) => {
    try {
      await api.delete(`/preguntas/${preguntaId}`);
      return { productoId, preguntaId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar la pregunta');
    }
  }
);

const preguntasSlice = createSlice({
  name: 'preguntas',
  initialState: {
    porProducto: {}, // { [productoId]: { items: [], loading, error } }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreguntas.pending, (state, action) => {
        const productoId = action.meta.arg;
        state.porProducto[productoId] = state.porProducto[productoId] || { items: [] };
        state.porProducto[productoId].loading = true;
      })
      .addCase(fetchPreguntas.fulfilled, (state, action) => {
        const { productoId, preguntas } = action.payload;
        state.porProducto[productoId] = state.porProducto[productoId] || { items: [] };
        state.porProducto[productoId].items = preguntas;
        state.porProducto[productoId].loading = false;
      })
      .addCase(fetchPreguntas.rejected, (state, action) => {
        const productoId = action.meta.arg;
        if (state.porProducto[productoId]) {
          state.porProducto[productoId].loading = false;
          state.porProducto[productoId].error = action.payload;
        }
      })
      .addCase(crearPregunta.fulfilled, (state, action) => {
        const { productoId, pregunta } = action.payload;
        const entry = state.porProducto[productoId] || { items: [] };
        entry.items.unshift(pregunta);
        state.porProducto[productoId] = entry;
      })
      .addCase(responderPregunta.fulfilled, (state, action) => {
        const { productoId, pregunta } = action.payload;
        const entry = state.porProducto[productoId];
        if (entry) {
          const idx = entry.items.findIndex((p) => p.id === pregunta.id);
          if (idx >= 0) entry.items[idx] = pregunta;
        }
      })
      .addCase(eliminarPregunta.fulfilled, (state, action) => {
        const { productoId, preguntaId } = action.payload;
        const entry = state.porProducto[productoId];
        if (entry) {
          entry.items = entry.items.filter((p) => p.id !== preguntaId);
        }
      });
  },
});

export default preguntasSlice.reducer;