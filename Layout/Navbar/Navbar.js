import Link from "next/link";
import { useRouter } from "next/router";
import { Badge, Search } from "../../components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Navbar.module.css";
import { useState } from "react";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function Navbar({ arrLink = [{ title: "", link: "" }] }) {
  const [search, setSearch] = useState("");
  const cart = useSelector((state) => state.cart);
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
  return (
    <div className={styles.nav}>
      <Link href="/">
        <a>Home</a>
      </Link>
      <div className={styles.bar}>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => router.push({ pathname: "/", query: { search } })}
        />
      </div>
      <div className={styles.bar}>
        {arrLink.map(
          (link, index) =>
            link.title && (
              <Link key={index} href={link.path}>
                <a>{link.title}</a>
              </Link>
            )
        )}
      </div>
      <div className={styles.bar}>
        {localStorage.getItem("permission") ? (
          <>
            <Link href="/profile">My Profile</Link>
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
        <Link href="/overview/cart">
          <a>
            <Badge value={cart.products.length}>
              <AiOutlineShoppingCart />
            </Badge>
          </a>
        </Link>
      </div>
    </div>
  );
}
