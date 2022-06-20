import { useRef, useEffect } from "react";

export default function useMountCount(cb, deps, count = 0) {
  const isFirstMount = useRef(0);
  useEffect(() => {
    if (isFirstMount.current >= count) cb();
    else isFirstMount.current += 1;
  }, deps);
}
