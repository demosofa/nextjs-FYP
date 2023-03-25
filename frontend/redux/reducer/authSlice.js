import { createSlice } from "@reduxjs/toolkit";
import parser from "jwt-decode";
import { publicApi } from "../api/publicApi";

const initialState = { accountId: null, username: null, role: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addMatcher(
        publicApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          const { role, username, accountId } = parser(payload);
          state.accountId = accountId;
          state.username = username;
          state.role = role;
        }
      )
      .addMatcher(
        publicApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          const { role, username, accountId } = parser(payload);
          state.accountId = accountId;
          state.username = username;
          state.role = role;
        }
      );
  },
});

export default authSlice.reducer;
