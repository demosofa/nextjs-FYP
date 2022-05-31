import Link from "next/link";
import { Search } from "../../components";
import styles from "./Navbar.module.css";

export default function Navbar({ apis = [{ title: "", link: "" }] }) {
  return (
    <div className={styles.nav}>
      <div className={styles.bar}>
        <Search />
      </div>
      <div className={styles.bar}>
        {apis.map((api, index) => (
          <Link key={index} href={api.link}>
            {api.title}
          </Link>
        ))}
      </div>
      <div className={styles.bar}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
