import Link from "next/link";
import { useRouter } from "next/router";
import { Badge, Search } from "../../components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Navbar.module.css";
import { expireStorage } from "../../utils";

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function Navbar({ arrLink = [{ title: "", link: "" }] }) {
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  const handleLogout = async () => {
    const accessToken = expireStorage.getItem("accessToken");
    try {
      await axios.post(`${LocalApi}/auth/logout`, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.clear();
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.nav}>
      <div className={styles.bar}>
        <Search />
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
        {localStorage.getItem("accessToken") ? (
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </span>
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
