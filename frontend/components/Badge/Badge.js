import { cloneElement } from "react";
import styles from "./badge.module.scss";

export default function Badge({ children, value = 0, ...props }) {
  return (
    <div className={styles.badge_container} {...props}>
      <div className={styles.badge}>{value}</div>
      {cloneElement(children, {
        style: {
          margin: 0,
          fontSize: "25px",
          color: "white",
        },
      })}
    </div>
  );
}
