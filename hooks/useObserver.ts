import { useRef, useCallback, DependencyList } from "react";

export default function useObserver({
  callback,
  isMany = true,
  deps = [],
  options,
}: {
  callback: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => void; //function for handling each entry
  isMany: boolean; //true or false if the target ref is Array or one
  deps: DependencyList; //Array for useCallback dependencies
  options?: IntersectionObserverInit; //config for object IntersectionObserver
}) {
  const observer = useRef<IntersectionObserver>(null);
  return useCallback((nodes: any) => {
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
  }, deps);
}
