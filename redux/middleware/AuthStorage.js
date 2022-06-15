import { expireStorage } from "../../utils";

const AuthStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("auth/")) {
    const authState = store.getState().auth;
    expireStorage.setItem("AuthStorage", authState);
  }
  return result;
};

export default AuthStorage;
