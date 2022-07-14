import { createSlice } from "@reduxjs/toolkit";

export const initialState = [{ name: "", options: [] }];

const variant = createSlice({
  initialState,
  name: "variant",
  reducers: {
    addVariant(state, action) {
      return [...state, ...initialState];
    },
    editVariant(state, { payload }) {
      const { index, ...props } = payload;
      const copy = state.concat();
      copy[index] = { ...copy[index], ...props };
      return copy;
    },
    deleteVariant(state, { payload }) {
      return state.filter((_, index) => index !== payload);
    },
  },
});

export default variant.reducer;
export const { addVariant, editVariant, deleteVariant } = variant.actions;
