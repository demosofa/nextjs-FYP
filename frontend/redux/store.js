import { configureStore } from "@reduxjs/toolkit";
import {
  cart,
  notification,
  variant,
  variation,
  recentlyViewed,
} from "./reducer";
import { cartStorage, recentlyViewedStorage } from "./middleware";
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
    recentlyViewed,
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
