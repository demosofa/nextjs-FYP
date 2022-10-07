import { useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./dropdown.module.scss";

export default function Dropdown({
  title,
  icon,
  isShow = false,
  clickable = true,
  hoverable = false,
  where = "right",
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  ...props
}) {
  const [toggle, setToggle] = useState(isShow);
  return (
    <div
      className={`${styles.dropdown} ${className}`}
      {...props}
      onClick={(e) => {
        if (typeof onClick === "function") onClick(e);
        if (clickable) setToggle((prev) => !prev);
      }}
      onMouseEnter={(e) => {
        if (typeof onMouseEnter === "function") onMouseEnter(e);
        if (hoverable && !clickable) setToggle(true);
      }}
      onMouseLeave={(e) => {
        if (typeof onMouseLeave === "function") onMouseLeave(e);
        if (hoverable) setToggle(false);
      }}
    >
      {title && <span>{title}</span>}
      {icon && <Icon>{icon}</Icon>}
      {toggle && (
        <div className={styles.dropdown_content} style={{ [where]: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}
