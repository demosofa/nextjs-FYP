import { useState } from "react";
import styles from "./dropdown.module.scss";

export default function Dropdown({
  component,
  isShow = false,
  clickable = true,
  hoverable = false,
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
      {component}
      {toggle && children}
    </div>
  );
}

Dropdown.Content = function DropdownContent({ children, className, ...props }) {
  return (
    <div className={`${styles.dropdown_content} ${className}`} {...props}>
      {children}
    </div>
  );
};
