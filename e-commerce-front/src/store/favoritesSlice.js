import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const response = await fetch('http://localhost:8080/api/favoritos', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener favoritos');
    return await response.json();
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (producto) => {
    const response = await fetch(`http://localhost:8080/api/favoritos/${producto.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Error al agregar favorito');
    return producto; 
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productoId) => {
    const response = await fetch(`http://localhost:8080/api/favoritos/${productoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Error al eliminar favorito');
    return productoId;
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
