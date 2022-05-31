import { useState, useCallback, useRef, useEffect, cloneElement } from "react";
import styles from "./Carousel.module.css";

function Carousel({
  isLinear = true,
  slidesDs = 1,
  slidesAni = 1,
  children,
  ...props
}) {
  const [numSlidesAni, setNumSlidesAni] = useState(isLinear ? 0 : -slidesAni);
  const [slides, setSlides] = useState(children);
  const [check, setCheck] = useState(true);
  const slideWidth = useRef(0);
  const carousel = useRef();

  useEffect(() => {
    window.onresize = () => {
      setCheck((prev) => !prev);
    };
  }, []);

  useEffect(() => {
    slideWidth.current = Math.floor(carousel.current.offsetWidth / slidesDs);
    let initialPos = numSlidesAni * slideWidth.current;
    [...carousel.current.children].forEach((child) => {
      child.style.width = slideWidth.current + "px";
      child.style.left = initialPos + "px";
      initialPos += slideWidth.current;
    });
  }, [check, slidesDs, slides, numSlidesAni]);

  const handleLeftClick = useCallback(() => {
    let cskSlide =
      carousel.current.firstElementChild.getBoundingClientRect().left;
    let cskCarousel = carousel.current.getBoundingClientRect().left;
    if (isLinear && cskSlide < cskCarousel)
      setNumSlidesAni((prev) => prev + slidesAni);
    else if (!isLinear) {
      for (let i = 0; i < slidesAni; i++) {
        setSlides((prev) => {
          let fstSlide = prev[0];
          const newArr = prev.filter((item) => item !== fstSlide);
          fstSlide = cloneElement(fstSlide, { key: Math.random() });
          return [...newArr, fstSlide];
        });
      }
    }
  }, [slidesAni, isLinear]);

  const handleRightClick = useCallback(() => {
    let cskSlide =
      carousel.current.lastElementChild.getBoundingClientRect().right;
    let cskCarousel = carousel.current.getBoundingClientRect().right;
    if (isLinear && cskSlide > cskCarousel)
      setNumSlidesAni((prev) => prev - slidesAni);
    else if (!isLinear) {
      for (let i = 0; i < slidesAni; i++) {
        setSlides((prev) => {
          let lstSlide = prev[prev.length - 1];
          const newArr = prev.filter((item) => item !== lstSlide);
          lstSlide = cloneElement(lstSlide, { key: Math.random() });
          return [lstSlide, ...newArr];
        });
      }
    }
  }, [slidesAni, isLinear]);

  return (
    <div className={styles.Carousel} {...props}>
      <button className={styles.button} onClick={handleLeftClick}></button>

      <div ref={carousel} className={styles.carousel_content}>
        {slides.map((chil) => {
          return chil;
        })}
      </div>

      <button className={styles.button} onClick={handleRightClick}></button>
    </div>
  );
}

export default Carousel;

// const handleCreate = () => {
//   let index = 0;
//   return (choice) => {
//     let con = choice ? 1 : -numSlides;
//     index = (index + con) % (children.length - 1);
//     if (index < 0) index = children.length - 1;
//     return React.createElement(
//       "div",
//       {
//         style: {
//           ...children[0].props.style,
//         },
//       },
//       array[index]
//     );
//   };
// };

// const runCreate = useMemo(() => handleCreate(), []);
