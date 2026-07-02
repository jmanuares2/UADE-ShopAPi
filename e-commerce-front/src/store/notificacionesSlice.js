import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchNotificaciones = createAsyncThunk(
  'notificaciones/fetchNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener las notificaciones');
    }
  }
);

export const fetchCantidadNoLeidas = createAsyncThunk(
  'notificaciones/fetchCantidadNoLeidas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notificaciones/no-leidas');
      return response.data.cantidad;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener la cantidad');
    }
  }
);

export const marcarComoLeida = createAsyncThunk(
  'notificaciones/marcarComoLeida',
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/notificaciones/${id}/leer`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al marcar como leída');
    }
  }
);

export const marcarTodasComoLeidas = createAsyncThunk(
  'notificaciones/marcarTodasComoLeidas',
  async (_, { rejectWithValue }) => {
    try {
      await api.put('/notificaciones/leer-todas');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al marcar todas como leídas');
    }
  }
);

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState: {
    items: [],
    cantidadNoLeidas: 0,
  },
  reducers: {
    // Se usa al hacer logout, para no arrastrar notificaciones de un usuario a otro.
    limpiarNotificaciones: (state) => {
      state.items = [];
      state.cantidadNoLeidas = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCantidadNoLeidas.fulfilled, (state, action) => {
        state.cantidadNoLeidas = action.payload;
      })
      .addCase(marcarComoLeida.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.items.find((n) => n.id === id);
        if (notif && !notif.leida) {
          notif.leida = true;
          state.cantidadNoLeidas = Math.max(0, state.cantidadNoLeidas - 1);
        }
      })
      .addCase(marcarTodasComoLeidas.fulfilled, (state) => {
        state.items.forEach((n) => { n.leida = true; });
        state.cantidadNoLeidas = 0;
      });
  },
});

export const { limpiarNotificaciones } = notificacionesSlice.actions;
export default notificacionesSlice.reducer;