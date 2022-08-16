import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Notification from "./Notification/Notification";
import Dashboard from "./Dashboard";
import General from "./General";
import { useMemo } from "react";
import { ManagerRole } from "./routes";

export default function Layout({ children, routerPath }) {
  const TargetLayout = useMemo(() => {
    if (["/dashboard"].includes(routerPath)) return Dashboard;
    else if (["/product"].includes(routerPath)) return Dashboard;
    else if (!["/login", "/register"].includes(routerPath)) return General;
  }, [routerPath]);
  if (!TargetLayout) return children;
  return <TargetLayout arrLink={ManagerRole}>{children}</TargetLayout>;
}

export { Navbar, Sidebar, Footer, Notification };
