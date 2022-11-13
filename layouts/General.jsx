import { useState } from "react";
import { Navbar, Sidebar, Footer, NotifyToast } from ".";
import { Animation, Icon, Search } from "../components";
import {
  AiOutlineMenuFold,
  AiOutlineShoppingCart,
  AiOutlineHome,
} from "react-icons/ai";
import Link from "next/link";
import { useMediaContext } from "../contexts/MediaContext";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";

export default function General({ children, arrLink }) {
  const { device, Devices } = useMediaContext();
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  return (
    <>
      {[Devices.lg, Devices["2xl"]].includes(device) ? (
        <Navbar arrLink={arrLink} />
      ) : toggle ? (
        <Animation.Move className="fixed z-20 h-screen gap-5 overflow-y-auto bg-[#f0f2f5] text-[#445261] shadow-md transition-all sm:w-screen md:w-80">
          <Sidebar className="!relative">
            <AiOutlineMenuFold
              className="absolute top-0 right-0 cursor-pointer"
              onClick={() => setToggle((prev) => !prev)}
            />
            {typeof window !== "undefined" &&
              localStorage.getItem("accessToken") && (
                <>
                  <Link href="/profile">
                    <a onClick={() => setToggle(!toggle)}>My Profile</a>
                  </Link>
                  <Link href="/notification">
                    <a onClick={() => setToggle(!toggle)}>
                      <FaBell />
                    </a>
                  </Link>
                </>
              )}
            <Link href="/">
              <a onClick={() => setToggle(!toggle)}>
                <Icon>
                  <AiOutlineHome />
                </Icon>
              </a>
            </Link>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => router.push({ pathname: "/", query: { search } })}
            />
            {arrLink?.map(({ title, path, icon }) => (
              <Link key={title} href={path}>
                <Sidebar.Item
                  className="!justify-start"
                  onClick={() => setToggle(!toggle)}
                >
                  {icon && <Icon>{icon}</Icon>}
                  {title}
                </Sidebar.Item>
              </Link>
            ))}
            <Link href="/c/cart">
              <Sidebar.Item
                className="!justify-start"
                onClick={() => setToggle(!toggle)}
              >
                <Icon>
                  <AiOutlineShoppingCart />
                </Icon>
                My Cart
              </Sidebar.Item>
            </Link>
          </Sidebar>
        </Animation.Move>
      ) : (
        <Icon
          style={{ position: "fixed", top: "10px", left: "10px" }}
          onClick={() => setToggle(!toggle)}
        >
          <AiOutlineMenuFold />
        </Icon>
      )}
      <main className="body">{children}</main>
      <Footer />
      <NotifyToast />
    </>
  );
}
