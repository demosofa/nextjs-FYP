import { useState } from "react";

export default function Dropdown({
  component,
  isShow = false,
  clickable = true,
  hoverable = false,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  ...props
}) {
  const [toggle, setToggle] = useState(isShow);
  return (
    <div
      className={`relative inline-flex justify-center text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 ${className}`}
      {...props}
      onClick={(e) => {
        if (typeof onClick === "function") onClick(e);
        if (clickable) setToggle((prev) => !prev);
      }}
      onMouseEnter={(e) => {
        if (typeof onMouseEnter === "function") onMouseEnter(e);
        if (hoverable && !clickable) setToggle(true);
      }}
      onMouseLeave={(e) => {
        if (typeof onMouseLeave === "function") onMouseLeave(e);
        if (hoverable) setToggle(false);
      }}
    >
      {component}
      {toggle && children}
    </div>
  );
}

Dropdown.Content = function DropdownContent({ children, className, ...props }) {
  return (
    <div
      className={`absolute z-10 mt-2 flex flex-col rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none [&>*]:px-4 [&>*]:py-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
