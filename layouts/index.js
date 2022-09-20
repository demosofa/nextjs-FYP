import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Notification from "./Notification/Notification";
import Dashboard from "./Dashboard";
import General from "./General";
import { createContext, useEffect, useMemo, useRef } from "react";
import { AdminRole, ShipperRole, SellerRole } from "./routes";
import { expireStorage } from "../utils";
import parser from "jwt-decode";
import { Role } from "../shared";
import { Realtime } from "ably/promises";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;
const AblyFe = createContext();

export default function Layout({ children, routerPath }) {
  const ably = useRef();
  const { role, username } = useMemo(() => {
    let decoded;
    if (typeof window !== "undefined" && localStorage.getItem("permission")) {
      decoded = parser(expireStorage.getItem("permission"));
      if (!ably.current)
        ably.current = new Realtime.Promise({
          authUrl: `${LocalApi}/createAblyToken`,
        });
      return decoded;
    }
    return { username: "", role: "" };
  }, [routerPath]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ably.current && username) {
      ably.current.channels.get(username).subscribe(({ name, data }) => {
        switch (name) {
          case "shipping":
            dispatch(addNotification({ message: data }));
            break;
          case "comment":
            dispatch(addNotification({ message: data }));
            break;
        }
      });
    }
  }, [ably.current, username]);

  const TargetLayout = useMemo(() => {
    if (["/admin/dashboard", "/product"].includes(routerPath)) return Dashboard;
    else if (!["/login", "/register"].includes(routerPath)) return General;
  }, [routerPath]);

  const child = (
    <AblyFe.Provider value={{ ably: ably.current }}>{children}</AblyFe.Provider>
  );
  if (!TargetLayout) return child;
  return (
    <TargetLayout
      arrLink={
        role
          ? (role === Role.admin && AdminRole) ||
            (role === Role.seller && SellerRole) ||
            (role === Role.shipper && ShipperRole) ||
            (role === Role.guest && [])
          : []
      }
    >
      {child}
    </TargetLayout>
  );
}

export { Navbar, Sidebar, Footer, Notification, AblyFe };
