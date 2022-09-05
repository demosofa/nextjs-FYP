import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { expireStorage } from "../../utils";
import { addCart, removeCart } from "../reducer/cartSlice";

const cartListenerMiddleware = createListenerMiddleware();
cartListenerMiddleware.startListening({
  matcher: isAnyOf(addCart, removeCart),
  effect: async (action, listenerApi) => {
    const cartState = listenerApi.getState().cart;
    expireStorage.setItem("cart", cartState, "5m");
  },
});

export default cartListenerMiddleware;
