import Link from "next/link";
import { Search, Icon } from "../../components";
import { getURL } from "../../utils";
import { AiOutlineMenuFold } from "react-icons/ai";
import styles from "./sideBar.module.scss";
import { useRouter } from "next/router";

export default function SideBar({
  arrLink = [],
  children,
  setToggle,
  ...props
}) {
  const router = useRouter();
  return (
    <div className={styles.side_bar} {...props}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Icon onClick={() => setToggle(false)}>
          <AiOutlineMenuFold />
        </Icon>
      </div>
      <Search />
      <nav className={styles.nav}>
        {arrLink.map((link, index) => {
          link.path = getURL(link.path);
          return (
            <Link key={index} to={link.path} className={styles.item}>
              {/* <Icon style={{ flex: "1" }}>{link.icon}</Icon> */}
              <span style={{ flex: 2 }}>{link.title}</span>
            </Link>
          );
        })}
        {children}
      </nav>
      <>
        <div onClick={() => router.push("/login")}>Login</div>
        <div onClick={() => router.push("/register")}>Register</div>
      </>
    </div>
  );
}
