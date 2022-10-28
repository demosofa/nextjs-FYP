import { Fragment, useRef } from "react";
import Checkbox from "../Checkbox/Checkbox";
import styles from "./StarRating.module.scss";

export default function StarRating({
  id = "star-rating_",
  name = id,
  value = 0,
  handleRating,
  size = "1.3rem",
  className,
  ...props
}) {
  const arrStar = useRef(
    [...Array.from({ length: 5 }, (_, i) => i + 1)].reverse()
  );
  return (
    <Checkbox
      type="radio"
      name={name}
      className={`${styles.rate} ${className}`}
      checked={[value]}
      setChecked={(data) => {
        if (typeof handleRating === "function" && value !== data[0])
          handleRating(data[0]);
      }}
      style={{ pointerEvents: handleRating ? "auto" : "none" }}
      {...props}
    >
      {arrStar.current.map((star) => {
        return (
          <Fragment key={star}>
            <Checkbox.Item
              className={styles.star}
              value={star}
              id={id + star}
            />
            <label htmlFor={id + star} style={{ "--size": size }} />

            <Checkbox.Item
              className={styles.star}
              value={star - 0.5}
              id={id + star + "-and-half"}
            />
            <label
              className={styles.half}
              htmlFor={id + star + "-and-half"}
              style={{ "--size": size }}
            />
          </Fragment>
        );
      })}
    </Checkbox>
  );
}
