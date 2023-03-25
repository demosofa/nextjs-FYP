import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { expireStorage } from "../../utils";
import { addViewed, removeAll } from "../reducer/recentlyViewedSlice";
import { RootState } from "../store";

const recentlyViewedListener = createListenerMiddleware();
recentlyViewedListener.startListening({
  matcher: isAnyOf(addViewed, removeAll),
  effect: async (action, listenerApi) => {
    const recentlyViewedState = (listenerApi.getState() as RootState)
      .recentlyViewed;
    expireStorage.setItem("recentlyViewed", recentlyViewedState, "2d");
  },
});

export default recentlyViewedListener;
