import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Notification from "./Notification/Notification";
import Dashboard from "./Dashboard";
import General from "./General";
import { createContext, useContext, useEffect, useMemo } from "react";
import { AdminRole } from "./routes";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../redux/reducer/notificationSlice";

const socket = io(process.env.NEXT_PUBLIC_LOCAL_URL);
const Socket = createContext(socket);

export default function Layout({ children, routerPath }) {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("notify", (data) => {
      dispatch(addNotification({ message: data }));
    });
    socket.on("connected", (data) => {
      dispatch(addNotification({ message: data }));
    });
    return () => socket.offAny();
  }, [socket]);

  const TargetLayout = useMemo(() => {
    if (["/dashboard", "/product"].includes(routerPath)) return Dashboard;
    else if (!["/login", "/register"].includes(routerPath)) return General;
  }, [routerPath]);

  const child = <Socket.Provider value={socket}>{children}</Socket.Provider>;
  if (!TargetLayout) return child;
  return <TargetLayout arrLink={AdminRole}>{child}</TargetLayout>;
}

export function useSocket() {
  return useContext(Socket);
}

export { Navbar, Sidebar, Footer, Notification };
