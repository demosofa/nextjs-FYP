import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

const pushCart = createAsyncThunk(
  "cart/PushToServer",
  async (body, { rejectWithValue }) => {
    return await axios
      .put(`${LocalApi}/cart`, body)
      .then((res) => res.data)
      .catch((err) => rejectWithValue(err));
  },
  {
    condition(body, { getState, extra }) {
      const { cart } = getState();
      const status = cart.requests[body];
      if (status === "fulfilled" || status === "loading") return false;
    },
  }
);

export default pushCart;
