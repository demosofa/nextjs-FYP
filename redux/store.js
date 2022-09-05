import { configureStore } from "@reduxjs/toolkit";
import { cart, notification, variant, variation } from "./reducer";
import { apiSlice } from "./api";
import cartListenerMiddleware from "./middleware/cartStorage";
import { expireStorage } from "../utils";

function loadState(name) {
  try {
    const serializedState = expireStorage.getItem(name);
    if (serializedState === null) {
      return undefined;
    }
    return serializedState;
  } catch (err) {
    return undefined;
  }
}

export const store = configureStore({
  devTools: true,
  reducer: {
    cart,
    notification,
    variant,
    variation,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      cartListenerMiddleware.middleware,
    ]),
  preloadedState: { cart: loadState("cart") },
});
