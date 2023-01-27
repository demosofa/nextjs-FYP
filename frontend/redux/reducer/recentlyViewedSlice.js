import { createSlice } from "@reduxjs/toolkit";

/**@type {{_id: string, productId: string, title: string, thumbnail: string, price: number, compare: number, avgRating: number, sold: number}[]} */
const initialState = [];

const recentlyViewed = createSlice({
  initialState,
  name: "recentlyViewed",
  reducers: {
    addViewed(state, { payload }) {
      const clone = JSON.parse(JSON.stringify(state));
      const index = clone.findIndex((item) => item._id === payload._id);
      if (index === -1) {
        if (clone.length >= 10) clone.shift();
        clone.push(payload);
      } else {
        clone[index] = payload;
      }
      return clone;
    },
    removeAll() {
      localStorage.removeItem("recentlyViewed");
      return initialState;
    },
  },
});

export const { addViewed, removeAll } = recentlyViewed.actions;
export default recentlyViewed.reducer;
