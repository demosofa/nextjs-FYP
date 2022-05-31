const AuthStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("auth/")) {
    const authState = store.getState().auth;
    localStorage.setItem("AuthStorage", JSON.stringify(authState));
  }
  return result;
};

export default AuthStorage;
