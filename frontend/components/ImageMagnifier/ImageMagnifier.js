import Image from "next/image";
import { useState, useRef } from "react";
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

  const handleMaginfier = ({ pageX, pageY }) => {
    const mag = maginfier.current;
    const left = compareToRange(
      pageX - mag.offsetWidth / 2 - offset.offsetLeft,
      0,
      offset.width - mag.offsetWidth
    );
    const top = compareToRange(
      pageY - mag.offsetHeight / 2 - offset.offsetTop,
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
      className="relative h-full"
      onMouseEnter={(e) => {
        setOffset(e.currentTarget);
      }}
      onMouseMove={(e) => offset && handleMaginfier(e)}
      onMouseLeave={() => setOffset(null)}
    >
      <Image
        className={` ${className}`}
        alt="magnifier"
        src={src}
        priority
        fill
        {...props}
      />
      {offset && (
        <div
          ref={maginfier}
          className="absolute top-0 h-20 w-20 cursor-none rounded-full border border-white"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `calc(${offset.width} * ${zoom}px)
                              calc(${offset.height} * ${zoom}px)`,
          }}
        />
      )}
    </div>
  );
}
