import decoder from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineMenuFold,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { Footer, Navbar, NotifyToast, Sidebar } from ".";
import { Animation, Icon, Search } from "../components";
import { useMediaContext } from "../contexts/MediaContext";

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
                  <Link href="/profile" onClick={() => setToggle(!toggle)}>
                    {decoder(localStorage.getItem("accessToken")).username}
                  </Link>
                  <Sidebar.Item
                    href="/notification"
                    className="w-10 group-hover:w-full group-hover:justify-start"
                    onClick={() => setToggle(!toggle)}
                  >
                    <Icon>
                      <FaBell />
                    </Icon>
                    <span className="hidden group-hover:inline-block">
                      Notification
                    </span>
                  </Sidebar.Item>
                </>
              )}
            <Sidebar.Item
              href="/"
              className="w-10 group-hover:w-full group-hover:justify-start"
            >
              <Icon>
                <AiOutlineHome />
              </Icon>
              <span className="hidden group-hover:inline-block">Home</span>
            </Sidebar.Item>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={() => router.push({ pathname: "/", query: { search } })}
            />
            {arrLink?.map(({ title, path, icon }) => (
              <Sidebar.Item
                key={title}
                href={path}
                className="!justify-start"
                onClick={() => setToggle(!toggle)}
              >
                {icon && <Icon>{icon}</Icon>}
                {title}
              </Sidebar.Item>
            ))}

            <Sidebar.Item
              href="/c/cart"
              className="!justify-start"
              onClick={() => setToggle(!toggle)}
            >
              <Icon>
                <AiOutlineShoppingCart />
              </Icon>
              My Cart
            </Sidebar.Item>
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
