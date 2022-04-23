import { useRef, useCallback } from "react";

export default function useObserver(
  isMany, //true or false if the target ref is Array or one
  callback, //function for handling each entry
  dependencies = [], //Array for useCallback dependencies
  options = null //config for object IntersectionObserver
) {
  const observer = useRef();
  return useCallback((nodes) => {
    if (observer.current) observer.current.disconnect();
    if (nodes !== null) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) callback(entry, observer.current);
          });
        },
        { root: isMany ? nodes : nodes.parentElement, ...options }
      );
      
      isMany
        ? [...nodes.children].forEach((node) => observer.current.observe(node))
        : observer.current.observe(nodes);
    }
  }, dependencies);
}
