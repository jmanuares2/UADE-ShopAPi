import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import cartReducer from './cartSlice';
import misComprasReducer from './misComprasSlice';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import resenasReducer from './resenaSlice';
import notificacionesReducer from './notificacionesSlice';


const persistConfig = {
  key: 'root',
  storage: {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  },
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  cart: cartReducer,
  misCompras: misComprasReducer,
  auth: authReducer,
  resenas: resenasReducer,
  notificaciones: notificacionesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
