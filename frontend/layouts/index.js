import parser from "jwt-decode";
import { useMemo } from "react";
import { isStringStartWith, Role } from "../../shared";
import { expireStorage } from "../utils";
import Dashboard from "./Dashboard";
import Footer from "./Footer/Footer";
import General from "./General";
import Navbar from "./Navbar/Navbar";
import NotifyToast from "./NotifyToast/NotifyToast";
import { AdminRole, SellerRole, ShipperRole } from "./routes";
import Sidebar from "./Sidebar/Sidebar";

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
    else if (
      !isStringStartWith(routerPath, [
        "/login",
        "/register",
        "/forgot_password",
      ])
    )
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
            (role === Role.customer && [])
          : []
      }
    >
      {children}
    </TargetLayout>
  );
}

export { Navbar, Sidebar, Footer, NotifyToast };
