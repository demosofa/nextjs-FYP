import { useState, useRef, useCallback } from "react";
import { useResize } from "../../hooks";
import { compareToRange } from "../../utils";

export default function ImageMagnifier({ zoom = 2, src, style, ...props }) {
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
      className="image__magnifier"
      style={{ ...style, position: "relative" }}
      onMouseEnter={() => setTrack(true)}
      onMouseMove={(e) => track && handleMaginfier(e)}
      onMouseLeave={() => setTrack(false)}
    >
      <img alt="magnifier" ref={target} src={src} {...props}></img>
      {track && (
        <div
          ref={maginfier}
          className="maginfier"
          style={{
            position: "absolute",
            width: "80px",
            height: "80px",
            top: 0,
            cursor: "none",
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
