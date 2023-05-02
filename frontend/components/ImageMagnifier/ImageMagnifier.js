import Image from "next/image";
import { useRef, useState } from "react";
import { compareToRange } from "@utils/index";

export default function ImageMagnifier({
  zoom = 2,
  src,
  style,
  className,
  ...props
}) {
  const magnifier = useRef();
  const [target, setTarget] = useState();

  const handleMagnifier = ({ pageX, pageY }) => {
    const mag = magnifier.current;
    const left = compareToRange(
      pageX - mag.offsetWidth / 2 - target.offsetLeft,
      0,
      target.offsetWidth - mag.offsetWidth
    );
    const top = compareToRange(
      pageY - mag.offsetHeight / 2 - target.offsetTop,
      0,
      target.offsetHeight - mag.offsetHeight
    );
    mag.style.left = `${left}px`;
    mag.style.top = `${top}px`;
    mag.style.backgroundPosition = `-${left * zoom + mag.offsetWidth / 2}px
                                    -${top * zoom + mag.offsetHeight / 2}px`;
  };

  return (
    <div
      className="relative h-full"
      onMouseEnter={(e) => {
        setTarget(e.currentTarget);
      }}
      onMouseMove={(e) => target && handleMagnifier(e)}
      onMouseLeave={() => setTarget(null)}
    >
      <Image
        className={` ${className}`}
        alt="magnifier"
        src={src}
        priority
        fill
        {...props}
      />
      {target && (
        <div
          ref={magnifier}
          className="absolute top-0 h-20 w-20 cursor-none rounded-full border border-white"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `calc(${target.offsetWidth} * ${zoom}px)
                            calc(${target.offsetHeight} * ${zoom}px)`,
          }}
        />
      )}
    </div>
  );
}
