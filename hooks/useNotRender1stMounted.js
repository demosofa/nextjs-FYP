import { useState, useRef } from "react";

export default function useNotRender1stMounted(initialValue) {
  let state = useRef(initialValue);
  const [newState, setNewState] = useState(state.current);

  const setState = (callback, toggled = true) => {
    let check = callback instanceof Function;
    if (toggled === false) {
      toggled = true;
      state.current = check ? callback(state.current) : callback;
    } else {
      check
        ? setNewState((prev) => {
            state.current = callback(prev);
            return state.current;
          })
        : setNewState(callback);
    }
  };
  return [state.current, setState];
}
