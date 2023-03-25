import { configureStore } from "@reduxjs/toolkit";
import parser from "jwt-decode";
import { expireStorage } from "../utils";
import { publicApi } from "./api/publicApi";
import { cartStorage, recentlyViewedStorage } from "./middleware";
import {
  auth,
  cart,
  modal,
  notification,
  recentlyViewed,
  variant,
  variation,
} from "./reducer";

function loadState(name: string) {
  try {
    let serializedState: any = expireStorage.getItem(name);
    if (serializedState === null) return undefined;
    if (name === "accessToken") {
      const { accountId, username, role } = <
        { accountId: string; username: string; role: string }
      >parser(serializedState);
      serializedState = { accountId, username, role };
    }
    return serializedState;
  } catch (error) {
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
    auth,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      cartStorage.middleware,
      recentlyViewedStorage.middleware,
      publicApi.middleware,
    ]),
  preloadedState: {
    cart: loadState("cart"),
    recentlyViewed: loadState("recentlyViewed"),
    auth: loadState("accessToken"),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
