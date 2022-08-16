import styles from "./Icon.module.css";
import { cloneElement } from "react";
export default function Icon({ children, className, ...props }) {
  return (
    <label className={`${styles.icon} ${className}`} {...props}>
      {cloneElement(children, { style: { margin: 0 } })}
    </label>
  );
}
