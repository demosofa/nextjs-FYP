import "keen-slider/keen-slider.min.css";
import {
  KeenSliderHooks,
  KeenSliderOptions,
  useKeenSlider,
} from "keen-slider/react";
import { cloneElement, createContext, useContext, useState } from "react";
import styles from "./slider.module.scss";

const Kits = createContext();

/**
 * @param {Object} prop
 * @param {KeenSliderOptions<{}, {}, KeenSliderHooks>} prop.config
 */
export default function Slider({ config = {}, children }) {
  const [loading, setLoading] = useState(false);
  const [sliderRef, slide] = useKeenSlider({
    ...config,
    created: (slider) => {
      if (typeof config.created === "function") config.created(slider);
      setLoading(true);
    },
  });
  return (
    <Kits.Provider value={{ sliderRef, slide: slide.current, loading }}>
      {children}
    </Kits.Provider>
  );
}

Slider.Content = function SliderContent({ children, className, ...props }) {
  const { sliderRef } = useContext(Kits);
  return (
    <div ref={sliderRef} className={"keen-slider " + className} {...props}>
      {children.map((child) => {
        return cloneElement(child, {
          className: "keen-slider__slide " + child.props.className,
        });
      })}
    </div>
  );
};

Slider.Arrow = function SliderArrow({ children, className, ...props }) {
  const { loading, slide } = useContext(Kits);
  const currentSlide = slide?.track.details.rel;
  const slideLength = slide?.track.details.slides.length - 1;
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
      {loading && slide && (
        <>
          <button
            className={`${styles.arrow} left-0 ml-3 ${
              currentSlide === 0 ? "hidden" : "block"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              slide?.prev();
            }}
          >
            {"<"}
          </button>
          <button
            className={` ${styles.arrow} right-0 mr-3 ${
              currentSlide === slideLength ? "hidden" : "block"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              slide?.next();
            }}
          >
            {">"}
          </button>{" "}
        </>
      )}
    </div>
  );
};
