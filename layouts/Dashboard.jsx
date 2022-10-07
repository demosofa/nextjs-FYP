import { Notification, Sidebar } from ".";
import Link from "next/link";
import { Animation, Icon } from "../components";
import { AiOutlineHome, AiOutlineArrowRight } from "react-icons/ai";
import dynamic from "next/dynamic";
import { useState } from "react";

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
        <Link href="/">
          <a>
            <Icon>
              <AiOutlineHome />
            </Icon>
          </a>
        </Link>
        {arrLink?.map(({ title, path, icon }) => (
          <Link key={title} href={path}>
            <Sidebar.Item
              key={title}
              className="w-10 group-hover:w-full group-hover:justify-start"
            >
              {icon && <Icon>{icon}</Icon>}
              <span className="hidden group-hover:inline-block">{title}</span>
            </Sidebar.Item>
          </Link>
        ))}
      </Sidebar>
      <div className="body">{children}</div>
      <Notification />
    </>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
