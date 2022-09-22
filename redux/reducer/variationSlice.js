import { createSlice } from "@reduxjs/toolkit";

/** @type {({ sku: string, types: string[], price: number, quantity: number }[])} */
const initialState = [];

const variation = createSlice({
  initialState,
  name: "variation",
  reducers: {
    addVariation(state, { payload }) {
      return payload.map((variant) => ({
        sku: "",
        types: variant,
        price: 0,
        quantity: 0,
      }));
    },
    editVariation(state, { payload }) {
      const { index, ...props } = payload;
      const clone = state.concat();
      clone[index] = { ...clone[index], ...props };
      return clone;
    },
    editAllVariations(state, { payload }) {
      const { price, quantity } = payload;
      return state.map((item) => ({ ...item, price, quantity }));
    },
    deleteVariation(state, { payload }) {
      return state.filter((_, index) => index !== payload);
    },
  },
});

export default variation.reducer;
export const {
  addVariation,
  editVariation,
  editAllVariations,
  deleteVariation,
} = variation.actions;
