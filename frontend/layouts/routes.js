import {
  MdOutlineDashboard,
  MdOutlineCategory,
  MdOutlineLocalShipping,
  MdOutlineSell,
} from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { BsBoxSeam, BsCartPlus } from "react-icons/bs";
import { TbShoppingCartDiscount } from "react-icons/tb";

const ShipperRole = [
  { title: "List pending Order", path: "/shipper", icon: <BsCartPlus /> },
  {
    title: "My Shipping",
    path: "/shipper/MyShipping",
    icon: <MdOutlineLocalShipping />,
  },
];

const SellerRole = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Product Management",
    path: "/product",
    icon: <BsBoxSeam />,
  },
  { title: "Seller", path: "/seller", icon: <MdOutlineSell /> },
];

const AdminRole = [
  {
    title: "Category Management",
    path: "/admin/category",
    icon: <MdOutlineCategory />,
  },
  {
    title: "Manage Order",
    path: "/admin/order",
    icon: <TbShoppingCartDiscount />,
  },
  {
    title: "Manage Account",
    path: "/admin/profiles",
    icon: <AiOutlineProfile />,
  },
  ...SellerRole,
  ...ShipperRole,
];

export { AdminRole, ShipperRole, SellerRole };
