import { BiSearchAlt2 } from "react-icons/bi";
import styles from "./search.module.scss";

export default function Search({ onClick, ...props }) {
  return (
    <div className={styles.search_wrapper}>
      <input {...props} />
      <BiSearchAlt2 style={{ color: "blue" }} onClick={onClick} />
    </div>
  );
}
