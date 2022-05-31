import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  total: 0,
  quantity: 0,
};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action) {
      const index = state.products.findIndex(
        (item) => item.name === action.payload.product.name
      );
      if (!index) state.products.push(action.payload.product);
      else state.products[index] = action.payload.product;
      state.quantity += action.payload.quantity;
      state.total += action.payload.total;
    },
    removeProduct(state, action) {
      state.quantity -= action.payload.quantity;
      state.products = state.products.filter(
        (item) => item.name !== action.payload.product.name
      );
      state.total -= action.payload.total;
    },
  },
});

export const { addProduct, removeProduct } = cart.actions;

export default cart.reducer;
