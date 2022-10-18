import { createSlice } from "@reduxjs/toolkit";

/**@type {({title: string, thumbnail: string, price: number, rate: number, url: string}[])} */
const initialState = [];

const recentlyViewed = createSlice({
  initialState,
  name: "recentlyViewed",
  reducers: {
    addViewed(state, { payload }) {
      const clone = JSON.parse(JSON.stringify(state));
      const result = clone.findIndex((item) => item.title === payload.title);
      if (result === -1) {
        if (clone.length >= 10) clone.shift();
        clone.push(payload);
      } else {
        clone.thumbnail = payload.thumbnail;
        clone.rate = payload.rate;
        clone.price = payload.price;
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
