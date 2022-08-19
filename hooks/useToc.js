import { useRef, useCallback } from "react";

export default function useToc() {
  const parent = useRef();
  const handleToc = useCallback(
    (e) => {
      if (!parent.current) parent.current = window;
      const parentDiv = parent.current;
      const { scrollWidth, scrollHeight, clientHeight, clientWidth } =
        parentDiv;
      let isOverflowY = scrollHeight > clientHeight;
      let isOverflowX = scrollWidth > clientWidth;
      if (!e || (!isOverflowY && !isOverflowX)) return;
      let top = e.target.offsetTop;
      let left = e.target.offsetLeft;
      parentDiv.scrollTop = top - clientHeight / 2;
      parentDiv.scrollLeft = left - clientWidth / 2;
    },
    [parent]
  );
  return [handleToc, parent];
}
