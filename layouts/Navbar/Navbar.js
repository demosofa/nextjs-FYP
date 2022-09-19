import Link from "next/link";
import { useRouter } from "next/router";
import { Badge, Search } from "../../components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import styles from "./Navbar.module.css";
import { useState } from "react";
import RouterAuth from "../../containers/RouterAuth/RouterAuth";

export default function Navbar({ arrLink }) {
  const [search, setSearch] = useState("");
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  return (
    <div className={styles.nav}>
      <div className={styles.bar}>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => router.push({ pathname: "/", query: { search } })}
        />
      </div>
      <div className={styles.bar}>
        {arrLink?.map(
          (link, index) =>
            link.title && (
              <Link key={index} href={link.path}>
                <a>{link.title}</a>
              </Link>
            )
        )}
      </div>
      <div className={styles.bar}>
        {localStorage.getItem("permission") && (
          <Link href="/profile">My Profile</Link>
        )}
        <RouterAuth />
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
