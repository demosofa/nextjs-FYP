import { ADD_VARIANT, DELETE_VARIANT, EDIT_VARIANT } from "./constants";

export const addVariant = (payload) => {
  return {
    type: ADD_VARIANT,
    payload,
  };
};
export const editVariant = (payload) => {
  return {
    type: EDIT_VARIANT,
    payload,
  };
};
export const deleteVariant = (payload) => {
  return {
    type: DELETE_VARIANT,
    payload,
  };
};
