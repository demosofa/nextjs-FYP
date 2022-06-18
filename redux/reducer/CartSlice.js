import { createSlice } from "@reduxjs/toolkit";
import pushCart from "../async/pushCart";

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
        (item) => item.title === action.payload.title
      );
      if (index === -1) state.products.push(action.payload);
      else state.products[index] = action.payload;
      state.quantity = state.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      state.total = Math.round(
        state.products.reduce((prev, curr) => prev + curr.total, 0)
      );
    },
    removeProduct(state, action) {
      state.products = state.products.filter(
        (item) => item.title !== action.payload.title
      );
      state.quantity = state.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      state.total = Math.round(
        state.products.reduce((prev, curr) => prev + curr.total, 0)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pushCart.fulfilled, (state, action) => {});
    builder.addCase(pushCart.rejected, (state, action) => {});
  },
});

export const { addProduct, removeProduct } = cart.actions;

export default cart.reducer;
