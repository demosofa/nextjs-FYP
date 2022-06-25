import { ADD_VARIANT, DELETE_VARIANT, EDIT_VARIANT } from "./constants";

export const initialState = [{ title: "", options: [] }];

export default function reducer(state, action) {
  const { payload, type } = action;
  switch (type) {
    case ADD_VARIANT:
      return [...state, initialState];
    case EDIT_VARIANT:
      const { index, ...props } = payload;
      let copy = state.concat();
      copy[index] = { ...copy[index], ...props };
      return copy;
    case DELETE_VARIANT:
      return state.filter((_, index) => index !== payload);
  }
}
