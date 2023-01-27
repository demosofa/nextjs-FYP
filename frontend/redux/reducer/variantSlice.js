import { createSlice } from "@reduxjs/toolkit";

/** @type {{ id: string, name: string, options: string[] }[]} */
export const initialState = [];

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
      const clone = state.concat();
      clone[index] = { ...clone[index], ...props };
      return clone;
    },
    deleteVariant(state, { payload }) {
      return state.filter((_, index) => index !== payload);
    },
    deleteAllVariant() {
      return [];
    },
  },
});

export default variant.reducer;
export const { addVariant, editVariant, deleteVariant, deleteAllVariant } =
  variant.actions;
