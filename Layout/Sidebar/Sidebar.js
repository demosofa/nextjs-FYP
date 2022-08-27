import Link from "next/link";
import { Search, Icon, Avatar } from "../../components";
import { expireStorage, getURL } from "../../utils";
import { AiOutlineMenuFold } from "react-icons/ai";
import styles from "./sideBar.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import decoder from "jwt-decode";
import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function Sidebar({
  arrLink = [],
  children,
  setToggle,
  ...props
}) {
  const auth = useState(() => {
    const permission = expireStorage.getItem("permission");
    const { role } = decoder(permission);
    return role;
  })[0];
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.post(`${LocalApi}/auth/logout`);
      localStorage.clear();
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(auth);

  const [check, setCheck] = useState(false);
  useEffect(() => {
    if (auth) setCheck(true);
  }, [auth]);

  return (
    <div className={styles.side_bar} {...props}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href="/profile">
          <a>
            <Avatar>My Profile</Avatar>
          </a>
        </Link>
        <Icon onClick={() => setToggle(false)}>
          <AiOutlineMenuFold />
        </Icon>
      </div>
      <Link href="/">
        <a>Home</a>
      </Link>
      {auth && (
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => router.push({ pathname: "/", query: { search } })}
        />
      )}
      <nav className={styles.nav}>
        {arrLink.map((link, index) => {
          link.path = getURL(link.path);
          return (
            <Link key={index} href={link.path}>
              {/* <Icon style={{ flex: "1" }}>{link.icon}</Icon> */}
              <a className={styles.item}>{link.title}</a>
            </Link>
          );
        })}
        {children}
      </nav>
      {(check && <div onClick={handleLogout}>Logout</div>) || (
        <>
          <div onClick={() => router.push("/login")}>Login</div>
          <div onClick={() => router.push("/register")}>Register</div>
        </>
      )}
    </div>
  );
}
