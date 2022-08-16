import { useContext, useState } from "react";
import { Navbar, Sidebar, Footer, Notification } from ".";
import { Icon } from "../components";
import { AiOutlineMenuFold } from "react-icons/ai";
import { Media } from "../pages/_app";

export default function General({ children, arrLink }) {
  const { device, Devices } = useContext(Media);
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {(device === Devices.pc && <Navbar arrLink={arrLink} />) ||
        (toggle ? (
          <Sidebar arrLink={arrLink} setToggle={setToggle}></Sidebar>
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
