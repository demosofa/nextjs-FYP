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
    addCart(state, action) {
      const clone = JSON.parse(JSON.stringify(state));
      const index = clone.products.findIndex(
        (item) => item.title === action.payload.title
      );
      if (index === -1) clone.products.push(action.payload);
      else clone.products[index] = action.payload;
      clone.quantity = clone.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      clone.total = Math.round(
        clone.products.reduce((prev, curr) => prev + curr.total, 0)
      );
      return clone;
    },
    removeCart(state, action) {
      const clone = JSON.parse(JSON.stringify(state));
      clone.products = clone.products.filter(
        (item) => item.title !== action.payload.title
      );
      clone.quantity = clone.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      clone.total = Math.round(
        clone.products.reduce((prev, curr) => prev + curr.total, 0)
      );
      return clone;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pushCart.fulfilled, (state, action) => {});
    builder.addCase(pushCart.rejected, (state, action) => {});
  },
});

export const { addCart, editCart, removeCart } = cart.actions;

export default cart.reducer;
