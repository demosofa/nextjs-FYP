import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { cloneElement } from "react";

export default function Slider({
  config = {},
  children,
  setSlide,
  setInstance,
  className,
  ...props
}) {
  const [sliderRef, instance] = useKeenSlider({
    ...config,
    slideChanged() {
      setSlide instanceof Function && setSlide(instance);
    },
    created() {
      setInstance instanceof Function && setInstance(instance);
    },
  });
  return (
    <div ref={sliderRef} className={className + " keen-slider"} {...props}>
      {children.map((child) => {
        return cloneElement(child, {
          className: child.className + " keen-slider__slide",
        });
      })}
    </div>
  );
}
