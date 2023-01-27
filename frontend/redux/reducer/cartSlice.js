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
      const clone = JSON.parse(JSON.stringify(state));
      const result = clone.products.filter(
        (item) => item.title === payload.title
      );
      if (result.length === 0) clone.products.push(payload);
      else {
        const index = clone.products.findIndex(
          (item) => item.variationId === payload.variationId
        );
        if (index === -1) clone.products.push(payload);
        else clone.products[index] = payload;
      }
      clone.quantity = clone.products.reduce(
        (prev, curr) => prev + curr.quantity,
        0
      );
      clone.total = Math.round(
        clone.products.reduce((prev, curr) => prev + curr.total, 0)
      );
      return clone;
    },
    removeCart(state, { payload }) {
      const clone = JSON.parse(JSON.stringify(state));
      if (payload.variationId)
        clone.products = clone.products.filter(
          (item) => item.variationId !== payload.variationId
        );
      else
        clone.products = clone.products.filter(
          (item) => item.title !== payload.title
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
    clearCart() {
      localStorage.removeItem("cart");
      return initialState;
    },
  },
});

export const { addCart, editCart, removeCart, clearCart } = cart.actions;

export default cart.reducer;
