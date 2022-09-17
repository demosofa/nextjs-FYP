import { expireStorage } from "../../utils";

const styleStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("style/")) {
    const styleSate = store.getState().style;
    expireStorage.setItem("style", styleSate);
  }
  return result;
};

export default styleStorage;
