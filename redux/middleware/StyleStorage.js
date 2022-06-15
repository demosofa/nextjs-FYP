import { expireStorage } from "../../utils";

const StyleStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("style/")) {
    const styleSate = store.getState().style;
    expireStorage.setItem("StyleStorage", styleSate);
  }
  return result;
};

export default StyleStorage;
