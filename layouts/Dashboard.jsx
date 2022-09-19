import { Sidebar } from ".";
import Link from "next/link";
import { Icon } from "../components";
import { AiOutlineHome } from "react-icons/ai";

export default function Dashboard({ children, arrLink }) {
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
            <a className="group-hover:w-full">
              <Sidebar.Item key={title} className="group-hover:justify-start">
                {icon && <Icon>{icon}</Icon>}
                <span className="hidden group-hover:inline-block">{title}</span>
              </Sidebar.Item>
            </a>
          </Link>
        ))}
      </Sidebar>
      <div className="body">{children}</div>
    </>
  );
}
