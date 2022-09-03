import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Icon } from "../";
import styles from "./increment.module.scss";

export default function Increment({
  value = 1,
  setValue = new Function(),
  plus = 1,
  minus = 1,
  min = 1,
  max = value + plus,
  ...props
}) {
  const [quantity, setQuantity] = useState(value);

  useEffect(() => {
    if (quantity > max) setQuantity(max);
    else if (quantity < min) setQuantity(min);
    else setValue(quantity);
  }, [quantity, min, max]);

  return (
    <div className={styles.set_quantity} {...props}>
      <Icon style={{ width: "50px", height: "50px" }}>
        <AiOutlineMinus
          className={`${styles.btn} ${styles.descrease}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuantity((prev) => {
              if (prev - minus >= min) return prev - minus;
              return prev;
            });
          }}
        />
      </Icon>

      <div className={styles.quantity}>{quantity}</div>

      <Icon style={{ width: "50px", height: "50px" }}>
        <AiOutlinePlus
          className={`${styles.btn} ${styles.increase}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuantity((prev) => {
              if (prev + plus <= max) return prev + plus;
              return prev;
            });
          }}
        />
      </Icon>
    </div>
  );
}
