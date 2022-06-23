import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Notification from "./Notification/Notification";
import { ManagerRole } from "../helpers/routes";
import { useContext } from "react";
import { Media } from "../pages/_app";

export default function Layout({ children }) {
  const { device, Devices } = useContext(Media);
  return (
    <>
      {device === Devices.pc ? <Navbar apis={ManagerRole} /> : <Sidebar />}
      <div className="body">{children}</div>
      <Footer />
      <Notification />
    </>
  );
}
