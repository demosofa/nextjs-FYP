import { useEffect } from "react";

export default function useResize(cb, deps = []) {
  useEffect(() => {
    const resize = () => cb instanceof Function && cb();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, deps);
}
