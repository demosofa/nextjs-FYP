import { useRef } from "react";

export default function useScroll() {
  const parent = useRef();
  const handleScroll = (e) => {
    if (!parent.current) parent.current = window;
    const parentDiv = parent.current;
    const { scrollWidth, scrollHeight, clientHeight, clientWidth } = parentDiv;
    var isOverflowY = scrollHeight > clientHeight;
    var isOverflowX = scrollWidth > clientWidth;
    if (!e || (!isOverflowY && !isOverflowX)) return;
    let top = e.target.offsetTop;
    let left = e.target.offsetLeft;
    parentDiv.scrollTop = top - clientHeight / 2;
    parentDiv.scrollLeft = left - clientWidth / 2;
  };
  return [handleScroll, parent];
}
