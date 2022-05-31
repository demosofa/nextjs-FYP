import { useState, useEffect } from "react";
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import { Icon } from "../";
import styles from "./increment.module.scss";

export default function Increment({
  value = 1,
  setValue = new Function(),
  ...props
}) {
  const [quantity, setQuantity] = useState(value);
  useEffect(() => {
    setValue(quantity);
  }, [quantity]);
  return (
    <div className={styles.set_quantity} {...props}>
      <Icon style={{ width: "50px", height: "50px" }}>
        <AiOutlineMinusSquare
          className={`${styles.btn} ${styles.descrease}`}
          onClick={() =>
            setQuantity((prev) => {
              if (prev > 1) return prev - 1;
              return prev;
            })
          }
        >
          -
        </AiOutlineMinusSquare>
      </Icon>

      <div className={styles.quantity}>{quantity}</div>

      <Icon style={{ width: "50px", height: "50px" }}>
        <AiOutlinePlusSquare
          className={`${styles.btn} ${styles.increase}`}
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </AiOutlinePlusSquare>
      </Icon>
    </div>
  );
}
