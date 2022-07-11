import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    title: "",
    thumbnail: null,
    type: [],
    price: 0,
    stock: 0,
  },
];

const variation = createSlice({
  initialState,
  name: "variation",
  reducers: {
    addVariation(state, { payload }) {
      return payload.map((variant) => ({
        title: "",
        thumbnail: null,
        type: variant,
        price: 0,
        stock: 0,
      }));
    },
    editVariation(state, { payload }) {
      const { index, ...props } = payload;
      const copy = state.concat();
      copy[index] = { ...copy[index], ...props };
      return copy;
    },
    deleteVariation(state, { payload }) {
      return state.filter((_, index) => index !== payload);
    },
  },
});

export default variation.reducer;
export const { addVariation, editVariation, deleteVariation } =
  variation.actions;
