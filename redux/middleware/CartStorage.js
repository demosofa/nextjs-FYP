const CartStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("cart/")) {
    const cartState = store.getState().cart;
    localStorage.setItem("CartStorage", JSON.stringify(cartState));
  }
  return result;
};

export default CartStorage;
