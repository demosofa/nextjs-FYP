import { Sidebar } from ".";
import Link from "next/link";
import { Icon } from "../components";
import { AiOutlineHome } from "react-icons/ai";
import dynamic from "next/dynamic";

function Dashboard({ children, arrLink }) {
  return (
    <>
      <Sidebar className="group w-[80px] hover:w-80">
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
    </>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
