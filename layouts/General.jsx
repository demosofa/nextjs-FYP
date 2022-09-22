import { useContext, useState } from "react";
import { Navbar, Sidebar, Footer, Notification } from ".";
import { Icon, Search } from "../components";
import {
  AiOutlineMenuFold,
  AiOutlineShoppingCart,
  AiOutlineHome,
} from "react-icons/ai";
import { Media } from "../pages/_app";
import Link from "next/link";

export default function General({ children, arrLink }) {
  const { device, Devices } = useContext(Media);
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {(device === Devices.pc && <Navbar arrLink={arrLink} />) ||
        (toggle ? (
          <Sidebar className="sm:w-full md:w-80 ">
            <AiOutlineMenuFold
              className="absolute top-0 right-0 cursor-pointer"
              onClick={() => setToggle((prev) => !prev)}
            />
            <Link href="/">
              <a>
                <Icon>
                  <AiOutlineHome />
                </Icon>
              </a>
            </Link>
            <Search />
            {arrLink?.map(({ title, path, icon }) => (
              <Link key={title} href={path}>
                <Sidebar.Item className="!justify-start">
                  {icon && <Icon>{icon}</Icon>}
                  {title}
                </Sidebar.Item>
              </Link>
            ))}
            <Link href="/overview/cart">
              <Sidebar.Item className="!justify-start">
                <Icon>
                  <AiOutlineShoppingCart />
                </Icon>
                My Cart
              </Sidebar.Item>
            </Link>
          </Sidebar>
        ) : (
          <Icon
            style={{ position: "fixed", top: "10px", left: "10px" }}
            onClick={() => setToggle(!toggle)}
          >
            <AiOutlineMenuFold />
          </Icon>
        ))}
      <div className="body">{children}</div>
      <Footer />
      <Notification />
    </>
  );
}
