import React, { useRef, useCallback, useLayoutEffect } from "react";

function ImageMagnifier({ children, zoom }) {
  let { current } = useRef(children.props.style);
  let ref;
  let offset = useRef();

  useLayoutEffect(() => {
    offset.current = ref.getBoundingClientRect();
  }, [ref]);

  const handleMouse = useCallback(
    ({ clientX, clientY }) => {
      ref.style.left = `${clientX - offset.current.left}px`;
      ref.style.top = `${clientY - offset.current.top}px`;
      ref.style.backgroundPosition = `-${ref.offsetLeft * zoom}px
                                    -${ref.offsetTop * zoom}px`;
    },
    [ref.offsetLeft, ref.offsetTop, ref.style, zoom]
  );

  return (
    <>
      {React.cloneElement(children, {
        children: (
          <div
            ref={(node) => {
              if (node) ref = node;
            }}
            className="magnifier"
            style={{
              ...styles.magnifier,
              backgroundImage: `${current.backgroundImage}`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `calc(${current.width} * ${zoom}px)
                              calc(${current.height} * ${zoom}px)`,
            }}
          ></div>
        ),
        style: current,
        onMouseMove: (e) => {
          handleMouse(e);
        },
      })}
    </>
  );
}

const styles = {
  magnifier: {
    width: "80px",
    height: "80px",
    position: "absolute",
    borderRadius: "50%",
    border: "1px solid",
    cursor: "none",
  },
};

export default ImageMagnifier;
