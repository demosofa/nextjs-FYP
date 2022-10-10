import { BiSearchAlt2 } from "react-icons/bi";
import styles from "./search.module.scss";

export default function Search({ onClick, className, ...props }) {
  return (
    <div className={`${styles.search_wrapper} ${className}`}>
      <input {...props} />
      <BiSearchAlt2 style={{ color: "orangered" }} onClick={onClick} />
    </div>
  );
}
