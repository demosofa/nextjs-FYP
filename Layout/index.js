import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { useMedia } from "../hooks";
import Devices from "../helpers/Devices";
import { createContext } from "react";
import { ManagerRole } from "../helpers/routes";

export const Media = createContext();

export default function Layout({ children }) {
  const device = useMedia();
  return (
    <Media.Provider value={{ device, Devices }}>
      {device === Devices.pc ? <Navbar apis={ManagerRole} /> : <Sidebar />}
      <div className="body">{children}</div>
      <Footer />
    </Media.Provider>
  );
}
