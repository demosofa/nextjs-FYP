import decoder from "jwt-decode";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineArrowRight, AiOutlineHome } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { NotifyToast, Sidebar } from ".";
import { Animation, Icon } from "../components";

function Dashboard({ children, arrLink }) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Icon
        className={`fixed ${
          toggle ? "left-20" : "left-4"
        } hidden !h-[auto] !w-[auto] bg-[#f0f2f5] p-2 sm:visible`}
        onClick={() => setToggle(!toggle)}
      >
        <Animation.Rotate state={toggle} deg={180}>
          <AiOutlineArrowRight />
        </Animation.Rotate>
      </Icon>

      <Sidebar
        className={`group w-[80px] hover:w-80 ${
          toggle ? "sm:left-0" : "sm:left-[-10rem]"
        }`}
      >
        {typeof window !== "undefined" &&
          localStorage.getItem("accessToken") && (
            <>
              <Link href="/profile" onClick={() => setToggle(!toggle)}>
                {decoder(localStorage.getItem("accessToken")).username}
              </Link>
              <Link href="/notification" onClick={() => setToggle(!toggle)}>
                <FaBell />
              </Link>
            </>
          )}
        <Link href="/">
          <Icon>
            <AiOutlineHome />
          </Icon>
        </Link>
        {arrLink?.map(({ title, path, icon }) => (
          <Sidebar.Item
            key={title}
            href={path}
            className="w-10 group-hover:w-full group-hover:justify-start"
          >
            {icon && <Icon>{icon}</Icon>}
            <span className="hidden group-hover:inline-block">{title}</span>
          </Sidebar.Item>
        ))}
      </Sidebar>
      <main className="body">{children}</main>
      <NotifyToast />
    </>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
