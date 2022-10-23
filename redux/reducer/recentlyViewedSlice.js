import { createSlice } from "@reduxjs/toolkit";

/**@type {({title: string, thumbnail: string, price: number, avgRating: number, url: string}[])} */
const initialState = [];

const recentlyViewed = createSlice({
  initialState,
  name: "recentlyViewed",
  reducers: {
    addViewed(state, { payload }) {
      const clone = JSON.parse(JSON.stringify(state));
      const index = clone.findIndex((item) => item.title === payload.title);
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
