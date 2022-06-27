import { ADD_VARIANT, DELETE_VARIANT, EDIT_VARIANT } from "./constants";

export let initialState = [{ name: "", options: [] }];

export default function reducer(state, action) {
  let copy;
  const { payload, type } = action;
  switch (type) {
    case ADD_VARIANT:
      return [...state, ...initialState];
    case EDIT_VARIANT:
      const { index, ...props } = payload;
      copy = state.concat();
      copy[index] = { ...copy[index], ...props };
      return copy;
    case DELETE_VARIANT:
      return state.filter((_, index) => index !== payload);
  }
}
