import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import styles from "./search.module.scss";

export default function Search({ setSearch }) {
  const [input, setInput] = useState("");
  return (
    <div className={styles.search_wrapper}>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <BiSearchAlt2 style={{ color: "blue" }} />
    </div>
  );
}
