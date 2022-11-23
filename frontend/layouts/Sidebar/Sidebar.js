import { forwardRef } from "react";
import RouterAuth from "../../containers/RouterAuth/RouterAuth";

export default function Sidebar({ children, className, ...props }) {
  return (
    <aside
      className={`fixed z-20 h-screen gap-5 overflow-x-hidden bg-[#f0f2f5] p-4 text-[#445261] shadow-md transition-all ${className}`}
      {...props}
    >
      <nav
        className={`relative flex flex-col items-center justify-start gap-[0.75em] overflow-y-auto rounded-lg p-[0.75em]`}
      >
        {children}
        <RouterAuth />
      </nav>
    </aside>
  );
}

Sidebar.Item = forwardRef(function SidebarItem(
  { children, className, ...props },
  ref
) {
  return (
    <a
      ref={ref}
      className={`flex w-full cursor-pointer items-center justify-center gap-[1em] rounded-lg bg-[#d0d6db40] p-[0.5em] transition-all hover:bg-[#037dff10]  ${className}`}
      {...props}
    >
      {children}
    </a>
  );
});
