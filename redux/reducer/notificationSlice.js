import { createSlice } from "@reduxjs/toolkit";

/** @type {({ id: string, message: string, type: string, href: string }[])} */
const initialState = [];

const notification = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, { payload }) {
      let check = false;
      while (!check) {
        payload.id = Math.random();
        let existed = state.filter((item) => item.id === payload.id);
        if (existed.length === 0) check = true;
      }
      state.push(payload);
    },
    removeNotification(state, { payload }) {
      return state.filter((item) => item.id !== payload);
    },
  },
});

export const { addNotification, removeNotification } = notification.actions;
export default notification.reducer;
