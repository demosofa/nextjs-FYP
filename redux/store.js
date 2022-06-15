import { configureStore } from "@reduxjs/toolkit";
import { cart } from "./reducer";
import CartStorage from "./middleware/CartStorage";
import AuthStorage from "./middleware/AuthStorage";
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
  reducer: { cart },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([CartStorage, AuthStorage]),
  preloadedState: { cart: loadState("CartStorage") },
});
