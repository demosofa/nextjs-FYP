import { useMemo } from "react";
import { useSelector } from "react-redux";
import { isStringStartWith, Role } from "../../shared";
import Dashboard from "./Dashboard";
import Footer from "./Footer/Footer";
import General from "./General";
import Navbar from "./Navbar/Navbar";
import NotifyToast from "./NotifyToast/NotifyToast";
import { AdminRole, SellerRole, ShipperRole } from "./routes";
import Sidebar from "./Sidebar/Sidebar";

export default function Layout({ children, routerPath }) {
  const { role } = useSelector((state) => state.auth);
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
      role={role}
    >
      {children}
    </TargetLayout>
  );
}

export { Navbar, Sidebar, Footer, NotifyToast };
