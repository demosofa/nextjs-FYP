import { createSlice } from "@reduxjs/toolkit";

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
      let getIndex = state.findIndex((item) => item.id === payload);
      state.splice(getIndex, 1);
    },
  },
});

export const { addNotification, removeNotification } = notification.actions;
export default notification.reducer;
