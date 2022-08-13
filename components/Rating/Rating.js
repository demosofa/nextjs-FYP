import { useRef, Fragment } from "react";
import { Checkbox } from "../";
import styles from "./rating.module.scss";

export default function Rating({ rated = 0, setRated = new Function() }) {
  const arrStar = useRef(
    [...Array.from({ length: 5 }, (_, i) => i + 1)].reverse()
  );
  return (
    <Checkbox
      type="radio"
      name="rating"
      className={styles.rate}
      checked={[rated]}
      setChecked={(data) => setRated(...data)}
    >
      {arrStar.current.map((star) => {
        return (
          <Fragment key={star}>
            <Checkbox.Item
              className={styles.star}
              value={star}
              id={"star-rating_" + star}
            >
              <label htmlFor={"star-rating_" + star}></label>
            </Checkbox.Item>
            <Checkbox.Item
              className={styles.star}
              value={star - 0.5}
              id={"star-rating_" + star + "-and-half"}
            >
              <label
                className={styles.half}
                htmlFor={"star-rating_" + star + "-and-half"}
              ></label>
            </Checkbox.Item>
          </Fragment>
        );
      })}
    </Checkbox>
  );
}
