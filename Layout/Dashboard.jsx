import { useState } from "react";
import { Sidebar } from ".";
import { Icon } from "../components";
import { AiOutlineMenuFold } from "react-icons/ai";

export default function Dashboard({ children, arrLink }) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {toggle ? (
        <Sidebar arrLink={arrLink} setToggle={setToggle}></Sidebar>
      ) : (
        <Icon
          style={{ position: "fixed", top: "10px", left: "10px" }}
          onClick={() => setToggle(!toggle)}
        >
          <AiOutlineMenuFold />
        </Icon>
      )}
      {children}
    </>
  );
}
