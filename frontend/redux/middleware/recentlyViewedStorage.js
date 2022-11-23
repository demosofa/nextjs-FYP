import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { expireStorage } from "../../utils";
import { addViewed, removeAll } from "../reducer/recentlyViewedSlice";

const recentlyViewedListerner = createListenerMiddleware();
recentlyViewedListerner.startListening({
  matcher: isAnyOf(addViewed, removeAll),
  effect: async (action, listenerApi) => {
    const recentlyViewedState = listenerApi.getState().recentlyViewed;
    expireStorage.setItem("recentlyViewed", recentlyViewedState, "2d");
  },
});

export default recentlyViewedListerner;
