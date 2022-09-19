import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_API;

const pushCart = createAsyncThunk(
  "cart/PushToServer",
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${LocalApi}/cart`, body);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default pushCart;
