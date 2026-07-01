import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import cartReducer from './cartSlice';
import misComprasReducer from './misComprasSlice';

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    misCompras: misComprasReducer
  },
});

export default store;
