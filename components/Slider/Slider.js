import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { cloneElement, createContext, useContext, useState } from "react";
import Icon from "../Icon/Icon";

const Kit = createContext();

export default function Slider({
  config = {},
  children,
  setSlide,
  setInstance,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    ...config,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      setSlide instanceof Function && setSlide(slider);
    },
    created() {
      setLoaded(true);
      setInstance instanceof Function && setInstance(instanceRef);
    },
  });
  return (
    <Kit.Provider value={{ sliderRef, instanceRef, currentSlide, loaded }}>
      {children}
    </Kit.Provider>
  );
}

Slider.Content = function Content({ children, className, ...props }) {
  const { sliderRef } = useContext(Kit);
  return (
    <div ref={sliderRef} className={className + " keen-slider"} {...props}>
      {children.map((child) => {
        return cloneElement(child, {
          className: "keen-slider__slide " + child.className,
        });
      })}
    </div>
  );
};

Slider.Arrow = function Arrow({ children, style, className, ...props }) {
  const { instanceRef, currentSlide, loaded } = useContext(Kit);
  if (!loaded) return undefined;
  return (
    <div className={className} style={style}>
      <Icon onClick={() => instanceRef.current?.prev()} {...props}></Icon>
      {children}
      <Icon onClick={() => instanceRef.current?.next()} {...props}></Icon>
    </div>
  );
};

Slider.Dot = function Dot({ children, ...props }) {
  const { instanceRef, currentSlide, loaded } = useContext(Kit);
  if (!loaded) return undefined;
  return (
    <div className="dots">
      {[...Array(instanceRef.current?.track.details.slides.length).keys()].map(
        (idx) => {
          return (
            <button
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx);
              }}
              className={"dot" + (currentSlide === idx ? " active" : "")}
              {...props}
            ></button>
          );
        }
      )}
    </div>
  );
};
