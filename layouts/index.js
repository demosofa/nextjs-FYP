import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Notification from "./Notification/Notification";
import Dashboard from "./Dashboard";
import General from "./General";
import { useMemo } from "react";
import { AdminRole, ShipperRole, SellerRole } from "./routes";
import { expireStorage } from "../utils";
import parser from "jwt-decode";
import { Role } from "../shared";

export default function Layout({ children, routerPath }) {
  const role = useMemo(() => {
    let decoded;
    if (typeof window !== "undefined" && localStorage.getItem("permission")) {
      decoded = parser(expireStorage.getItem("permission"));
      return decoded.role;
    }
    return null;
  }, [routerPath]);

  const TargetLayout = useMemo(() => {
    if (["/admin/dashboard", "/product"].includes(routerPath)) return Dashboard;
    else if (!["/login", "/register"].includes(routerPath)) return General;
  }, [routerPath]);

  if (!TargetLayout) return children;
  return (
    <TargetLayout
      arrLink={
        role &&
        ((role === Role.admin && AdminRole) ||
          (role === Role.seller && SellerRole) ||
          (role === Role.shipper && ShipperRole) ||
          (role === Role.guest && []))
      }
    >
      {children}
    </TargetLayout>
  );
}

export { Navbar, Sidebar, Footer, Notification };
