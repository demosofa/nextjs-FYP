import Icon from "../Icon/Icon";
import styles from "./dropdown.module.scss";

export default function Dropdown({
  title,
  icon,
  toggle,
  setToggle,
  children,
  where = "right",
  ...props
}) {
  return (
    <div className={styles.dropdown} {...props}>
      <div className={styles.btn_dropdown} onClick={() => setToggle(!toggle)}>
        {title && <span>{title}</span>}
        {icon && <Icon>{icon}</Icon>}
        {toggle && (
          <div className={styles.dropdown_content} style={{ [where]: 0 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
