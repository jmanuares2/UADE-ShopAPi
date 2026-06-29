import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchMisCompras = createAsyncThunk(
  'misCompras/fetchMisCompras',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mis-compras');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar las compras');
    }
  }
);

export const eliminarVenta = createAsyncThunk(
  'misCompras/eliminarVenta',
  async (ventaId, { rejectWithValue }) => {
    try {
      await api.delete(`/mis-compras/${ventaId}`);
      return ventaId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar la compra');
    }
  }
);

export const limpiarHistorial = createAsyncThunk(
  'misCompras/limpiarHistorial',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/mis-compras');
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al limpiar el historial');
    }
  }
);

const misComprasSlice = createSlice({
  name: 'misCompras',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMisCompras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMisCompras.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(eliminarVenta.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(limpiarHistorial.fulfilled, (state) => {
        state.items = [];
      })
  },
});

export const { clearError } = misComprasSlice.actions;
export default misComprasSlice.reducer;