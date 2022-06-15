import { expireStorage } from "../../utils";

const CartStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("cart/")) {
    const cartState = store.getState().cart;
    expireStorage.setItem("CartStorage", cartState, "5m");
  }
  return result;
};

export default CartStorage;
