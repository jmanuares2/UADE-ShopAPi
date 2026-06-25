import { createSlice } from '@reduxjs/toolkit';

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
