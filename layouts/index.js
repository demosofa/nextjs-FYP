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
import { isStringStartWith, Role } from "../shared";
import { Realtime } from "ably/promises";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;
const AblyFe = createContext();

export default function Layout({ children, routerPath }) {
  const ably = useRef();
  const { role, accountId } = useMemo(() => {
    let decoded;
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      decoded = parser(expireStorage.getItem("accessToken"));
      if (!ably.current)
        ably.current = new Realtime.Promise({
          authUrl: `${LocalApi}/createAblyToken`,
        });
      return decoded;
    }
    return { accountId: "", role: "" };
  }, [routerPath]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ably.current && accountId) {
      ably.current.channels.get(accountId).subscribe(({ name, data }) => {
        switch (name) {
          case "shipping":
            dispatch(addNotification({ ...data }));
            break;
          case "comment":
            dispatch(addNotification({ ...data }));
            break;
        }
      });
    }
  }, [ably.current, accountId]);

  const TargetLayout = useMemo(() => {
    if (isStringStartWith(routerPath, ["/admin", "/product"])) return Dashboard;
    else if (!isStringStartWith(routerPath, ["/login", "/register"]))
      return General;
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
