import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.nav}>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  );
}
