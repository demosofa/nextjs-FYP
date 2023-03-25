import { createSlice } from "@reduxjs/toolkit";

/**
 * @typedef {{
 *  productId: string,
 *  variationId: string,
 *  title: string,
 *  image: string,
 *  options: string[],
 *  extraCostPerItem: number,
 *  quantity: number,
 *  price: number,
 *  total: number,
 *}} Product
 */

/** @type {{ products: Product[], total: number, quantity: number }} */
const initialState = {
  products: [],
  total: 0,
  quantity: 0,
};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, { payload }) {
      const result = state.products.filter(
        (item) => item.title === payload.title
      );
      if (result.length === 0) state.products.push(payload);
      else {
        const index = state.products.findIndex(
          (item) => item.variationId === payload.variationId
        );
        if (index === -1) state.products.push(payload);
        else state.products[index] = payload;
      }
      state.quantity = state.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      state.total = Math.round(
        state.products.reduce((prev, curr) => prev + curr.total, 0)
      );
    },
    removeCart(state, { payload }) {
      if (payload.variationId)
        state.products = state.products.filter(
          (item) => item.variationId !== payload.variationId
        );
      else
        state.products = state.products.filter(
          (item) => item.title !== payload.title
        );
      state.quantity = state.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      state.total = Math.round(
        state.products.reduce((prev, curr) => prev + curr.total, 0)
      );
    },
    clearCart() {
      localStorage.removeItem("cart");
      return initialState;
    },
  },
});

export const { addCart, editCart, removeCart, clearCart } = cart.actions;
export default cart.reducer;
