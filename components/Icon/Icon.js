import styles from "./Icon.module.css";
import { cloneElement } from "react";
export default function Icon({ children, className, style, ...props }) {
  return (
    <div className={`${styles.icon} ${className}`} {...props}>
      {cloneElement(children, { style: { margin: 0, ...style } })}
    </div>
  );
}
