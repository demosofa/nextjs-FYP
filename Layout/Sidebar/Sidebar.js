import Link from "next/link";
import { Search, Icon } from "../../components";
import { getURL } from "../../utils";
import { AiOutlineMenuFold } from "react-icons/ai";
import styles from "./sideBar.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function SideBar({
  arrLink = [],
  children,
  setToggle,
  ...props
}) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.post(`${LocalApi}/auth/logout`, "", {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
      });
      localStorage.clear();
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const [check, setCheck] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) setCheck(true);
  });

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
      {(check && <div onClick={handleLogout}>Logout</div>) || (
        <>
          <div onClick={() => router.push("/login")}>Login</div>
          <div onClick={() => router.push("/register")}>Register</div>
        </>
      )}
    </div>
  );
}
