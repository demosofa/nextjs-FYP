import Link from "next/link";
import { useRouter } from "next/router";
import { Badge, Dropdown, Search } from "../../components";
import { Notification } from "../../containers";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
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
          onClick={() =>
            router.push({ pathname: "/", query: { ...router.query, search } })
          }
        />
      </div>
      <div className={styles.bar}>
        {linkNav?.map((link, index) =>
          link.title ? (
            <Link key={index} href={link.path}>
              <a className="pl-2 pr-2">{link.title}</a>
            </Link>
          ) : null
        )}
        {linkDrop.length ? (
          <Dropdown component={<button className="text-white">Other</button>}>
            <Dropdown.Content className="right-0 origin-top-right">
              {linkDrop?.map(
                (link, index) =>
                  link.title && (
                    <Link key={index} href={link.path}>
                      <a className="whitespace-nowrap text-black hover:bg-orange-400 hover:text-white">
                        {link.title}
                      </a>
                    </Link>
                  )
              )}
            </Dropdown.Content>
          </Dropdown>
        ) : null}
      </div>
      <div className={styles.bar}>
        {localStorage.getItem("accessToken") && (
          <>
            <Link href="/profile">My Profile</Link>
            <Dropdown
              component={<FaBell color="white" />}
              hoverable={true}
              clickable={false}
            >
              <Dropdown.Content className="right-0 max-h-[85vh] w-64 overflow-y-auto">
                <Notification />
              </Dropdown.Content>
            </Dropdown>
          </>
        )}
        <RouterAuth />
        <Link href="/c/cart">
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
