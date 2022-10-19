import React from "react";
import { useSpring, useTransition, animated, config } from "react-spring";

export default function Animation() {
  return;
}

Animation.Fade = function AnimateFade({ children, style, ...props }) {
  const transition = useTransition(children, {
    keys: (item) => item.key,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 600 },
  });
  return transition(
    (prop, item) =>
      item && (
        <animated.div style={{ ...style, ...prop }} {...props}>
          {item}
        </animated.div>
      )
  );
};

Animation.Dropdown = function AnimateDropdown({ children, style, ...props }) {
  const transition = useTransition(children, {
    keys: (item) => item.key,
    from: { maxHeight: 0, overflow: "hidden" },
    enter: (item) => async (next, cancel) => {
      await next({ maxHeight: 800 });
      await next({ overflow: "visible" });
    },
    leave: [{ overflow: "hidden" }, { maxHeight: 0 }],
    config: { duration: 600 },
  });
  return transition(
    (prop, item) =>
      item && (
        <animated.div style={{ ...style, ...prop }} {...props}>
          {item}
        </animated.div>
      )
  );
};

Animation.Rotate = function AnimateRotate({
  children,
  state,
  deg,
  style,
  ...props
}) {
  const spring = useSpring({
    transform: `rotate(${state ? deg : 0}deg)`,
    ...style,
  });
  return (
    <animated.div style={spring} {...props}>
      {children}
    </animated.div>
  );
};

Animation.Zoom = function AnimateZoom({ children, zoom = 1, style, ...props }) {
  let [x, y] = zoom instanceof Object ? [zoom.x, zoom.y] : [zoom, zoom];
  const transition = useTransition(children, {
    keys: (item) => item.key,
    from: { transform: `scale(0)`, opacity: 0 },
    enter: { transform: `scale(${x}, ${y})`, opacity: 1 },
    leave: { transform: `scale(0, 0)`, opacity: 0 },
    delay: 200,
    reset: false,
  });
  return transition(
    (prop, item) =>
      item && (
        <animated.div style={{ ...style, ...prop }} {...props}>
          {item}
        </animated.div>
      )
  );
};

Animation.Width = function AnimateWidth({ children, style, ...props }) {
  const transition = useTransition(children, {
    keys: (item) => item.key,
    from: { maxWidth: 0 },
    enter: { maxWidth: 200 },
    leave: { maxWidth: 0 },
    config: { duration: 400 },
  });
  return transition(
    (prop, item) =>
      item && (
        <animated.div style={{ ...style, ...prop }} {...props}>
          {item}
        </animated.div>
      )
  );
};

Animation.Move = function AnimateMove({
  children,
  reverse = true,
  className,
  style,
  ...props
}) {
  const transition = useTransition(children, {
    keys: (item) => item.key,
    from: {
      transform: reverse ? "translateX(-100%)" : "translateX(100%)",
    },
    enter: { transform: "translateX(0%)" },
    leave: {
      transform: reverse ? "translateX(-100%)" : "translateX(100%)",
    },
    config: { duration: 200 },
  });
  return transition(
    (prop, item) =>
      item && (
        <animated.div
          className={className}
          style={{ ...style, ...prop }}
          {...props}
        >
          {item}
        </animated.div>
      )
  );
};
