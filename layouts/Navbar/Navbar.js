import Link from "next/link";
import { useRouter } from "next/router";
import { Badge, Dropdown, Search } from "../../components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import styles from "./Navbar.module.css";
import { useMemo, useState } from "react";
import RouterAuth from "../../containers/RouterAuth/RouterAuth";

export default function Navbar({ arrLink }) {
  const [linkNav, linkDrop] = useMemo(() => {
    let linkInNav = arrLink.slice(0, 4);
    let linkInDrop = arrLink.slice(4);
    return [linkInNav, linkInDrop];
  }, [arrLink]);
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
        {linkNav?.map(
          (link, index) =>
            link.title && (
              <Link key={index} href={link.path}>
                <a className="pl-2 pr-2">{link.title}</a>
              </Link>
            )
        )}
        <Dropdown
          className="pl-3"
          where="left"
          title={<div className="text-white">Other</div>}
        >
          {linkDrop?.map(
            (link, index) =>
              link.title && (
                <Link key={index} href={link.path}>
                  <a className="whitespace-nowrap text-black">{link.title}</a>
                </Link>
              )
          )}
        </Dropdown>
      </div>
      <div className={styles.bar}>
        {localStorage.getItem("accessToken") && (
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
