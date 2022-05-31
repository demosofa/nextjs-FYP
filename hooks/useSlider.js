import { useCallback, useState, useRef } from "react";
import { compareToRange } from "../utils";

export default function useSlider(
  loop = false,
  display = 1,
  vertical = false,
  dependencies = []
) {
  const [current, setCurrent] = useState(0);
  const Ref = useRef();

  const moveTo = (value) => {
    let length = Ref.current?.children.length;
    let data = value instanceof Function ? value(current) : value;
    if (loop) data = data < 0 ? length - 1 : data % length;
    else data = compareToRange(data, 0, length - 1);
    setCurrent(data);
  };

  const targetRef = useCallback(
    (node) => {
      if (!node) return;
      Ref.current = node;
      console.log(node.style);
      node.style.position = "relative";
      node.style.overflow = "hidden";
      const Size = node[vertical ? "offsetHeight" : "offsetWidth"];
      const slideSize = Math.floor(Size / display);
      let initialPos = -current * slideSize;
      [...node.children].forEach((child) => {
        child.style.position = "absolute";
        child.style[vertical ? "width" : "height"] = "100%";
        child.style[vertical ? "height" : "width"] = slideSize + "px";
        child.style[vertical ? "left" : "top"] = 0;
        child.style[vertical ? "top" : "left"] = initialPos + "px";
        initialPos += slideSize;
      });
    },
    [current, vertical, display, ...dependencies]
  );

  return [targetRef, moveTo, current];
}
