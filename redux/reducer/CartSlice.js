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
      const copy = JSON.parse(JSON.stringify(state));
      const index = copy.products.findIndex(
        (item) => item.title === action.payload.title
      );
      if (index === -1) copy.products.push(action.payload);
      else copy.products[index] = action.payload;
      copy.quantity = copy.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      copy.total = Math.round(
        copy.products.reduce((prev, curr) => prev + curr.total, 0)
      );
      return copy;
    },
    removeCart(state, action) {
      const copy = JSON.parse(JSON.stringify(state));
      copy.products = copy.products.filter(
        (item) => item.title !== action.payload.title
      );
      copy.quantity = copy.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      copy.total = Math.round(
        copy.products.reduce((prev, curr) => prev + curr.total, 0)
      );
      return copy;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pushCart.fulfilled, (state, action) => {});
    builder.addCase(pushCart.rejected, (state, action) => {});
  },
});

export const { addCart, editCart, removeCart } = cart.actions;

export default cart.reducer;
