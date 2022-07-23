import { createSlice } from "@reduxjs/toolkit";

export const initialState = [{ id: null, name: "", options: [] }];

const variant = createSlice({
  initialState,
  name: "variant",
  reducers: {
    addVariant(state) {
      let check = false;
      let unique = { ...initialState.concat()[0] };
      while (!check) {
        unique.id = Math.random();
        let existed = state.filter((item) => item.id === unique.id);
        if (existed.length === 0) check = true;
      }
      return [...state, unique];
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
