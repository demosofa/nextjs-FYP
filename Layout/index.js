import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { useMedia } from "../hooks";

export default function Layout({ children }) {
  const device = useMedia();
  return (
    <>
      {device === "pc" ? <Navbar /> : <Sidebar />}
      {children}
      <Footer />
    </>
  );
}
