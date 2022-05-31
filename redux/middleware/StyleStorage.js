const StyleStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("style/")) {
    const styleSate = store.getState().style;
    localStorage.setItem("StyleStorage", JSON.stringify(styleSate));
  }
  return result;
};

export default StyleStorage;
