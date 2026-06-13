import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const fetchCartItems = createAsyncThunk (

    'cart/fetchCartItems',
    async () => {
      const response = await fetch('http://localhost:8080/api/carrito', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        credentials: 'include',
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }
      const data = await response.json();
      return data;
    }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    emptyCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
