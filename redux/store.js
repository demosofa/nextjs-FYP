import { configureStore } from "@reduxjs/toolkit";
import { cart, notification, variant, variation } from "./reducer";
import { productApi } from "./api";
import CartStorage from "./middleware/CartStorage";
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
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([CartStorage, productApi.middleware]),
  preloadedState: { cart: loadState("CartStorage") },
});
