import Link from "next/link";
import { Badge, Search } from "../../components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";

export default function Navbar({ apis = [{ title: "", link: "" }] }) {
  const cart = useSelector((state) => state.cart);
  return (
    <div className={styles.nav}>
      <div className={styles.bar}>
        <Search />
      </div>
      <div className={styles.bar}>
        {apis.map(
          (api, index) =>
            api.title && (
              <Link key={index} href={api.link}>
                {api.title}
              </Link>
            )
        )}
      </div>
      <div className={styles.bar}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
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
