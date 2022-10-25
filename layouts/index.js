import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import NotifyToast from "./NotifyToast/NotifyToast";
import Dashboard from "./Dashboard";
import General from "./General";
import { useMemo } from "react";
import { AdminRole, ShipperRole, SellerRole } from "./routes";
import { expireStorage } from "../utils";
import parser from "jwt-decode";
import { isStringStartWith, Role } from "../shared";

export default function Layout({ children, routerPath }) {
  const { role } = useMemo(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      let decoded = parser(expireStorage.getItem("accessToken"));
      return decoded;
    }
    return { accountId: "", role: "" };
  }, [routerPath]);

  const TargetLayout = useMemo(() => {
    if (
      isStringStartWith(routerPath, [
        "/admin",
        "/seller",
        "/shipper",
        "/product",
        "/dashboard",
      ])
    )
      return Dashboard;
    else if (!isStringStartWith(routerPath, ["/login", "/register"]))
      return General;
  }, [routerPath]);

  if (!TargetLayout) return children;
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
      {children}
    </TargetLayout>
  );
}

export { Navbar, Sidebar, Footer, NotifyToast };
