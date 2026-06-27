import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favoritos');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (producto, { rejectWithValue }) => {
    try {
      await api.post(`/favoritos/${producto.id}`);
      return producto;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error adding favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productoId, { rejectWithValue }) => {
    try {
      await api.delete(`/favoritos/${productoId}`);
      return productoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error removing favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    clearFavorites: (state) => {
        state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
