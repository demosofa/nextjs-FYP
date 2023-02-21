import { configureStore } from "@reduxjs/toolkit";
import { expireStorage } from "../utils";
import { cartStorage, recentlyViewedStorage } from "./middleware";
import {
  cart,
  modal,
  notification,
  recentlyViewed,
  variant,
  variation,
} from "./reducer";

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
    recentlyViewed,
    modal,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      cartStorage.middleware,
      recentlyViewedStorage.middleware,
    ]),
  preloadedState: {
    cart: loadState("cart"),
    recentlyViewed: loadState("recentlyViewed"),
  },
});