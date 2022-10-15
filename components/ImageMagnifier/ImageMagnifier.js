import { useState, useRef, useCallback } from "react";
import { useResize } from "../../hooks";
import { compareToRange } from "../../utils";

export default function ImageMagnifier({
  zoom = 2,
  src,
  style,
  className,
  ...props
}) {
  const maginfier = useRef();
  const [offset, setOffset] = useState();
  const [track, setTrack] = useState(false);
  const [resize, setResize] = useState(false);

  useResize(() => setResize((prev) => !prev), []);

  const target = useCallback(
    (node) => {
      node && setOffset(node.getBoundingClientRect());
    },
    [resize]
  );

  const handleMaginfier = ({ pageX, pageY }) => {
    const mag = maginfier.current;
    const left = compareToRange(
      pageX - mag.offsetWidth / 2 - offset.left,
      0,
      offset.width - mag.offsetWidth
    );
    const top = compareToRange(
      pageY - mag.offsetHeight / 2 - offset.top,
      0,
      offset.height - mag.offsetHeight
    );
    mag.style.left = `${left}px`;
    mag.style.top = `${top}px`;
    mag.style.backgroundPosition = `-${
      mag.offsetLeft * zoom + mag.offsetWidth / 2
    }px
    -${mag.offsetTop * zoom + mag.offsetHeight / 2}px`;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setTrack(true)}
      onMouseMove={(e) => track && handleMaginfier(e)}
      onMouseLeave={() => setTrack(false)}
    >
      <img
        className={` ${className}`}
        alt="magnifier"
        ref={target}
        src={src}
        {...props}
      />
      {track && (
        <div
          ref={maginfier}
          className="absolute top-0 h-20 w-20 cursor-none"
          style={{
            border: "1px solid white",
            borderRadius: "50%",
            backgroundImage: `url(${src})`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `calc(${offset.width} * ${zoom}px)
                              calc(${offset.height} * ${zoom}px)`,
          }}
        ></div>
      )}
    </div>
  );
}
