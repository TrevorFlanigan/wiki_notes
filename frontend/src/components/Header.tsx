import { MenuIcon } from "@heroicons/react/solid";
import React from "react";
import { Link } from "react-router-dom";
import Links from "./Links";

type HeaderProps = {
  children?: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <div className="shadow bg-base-200 drawer h-screen">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col drawer-content">
        <div className="rounded-b-lg w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <MenuIcon className="w-7 h-7" />
            </label>
          </div>
          {/* Top navigation on large screens */}

          <div className="flex-none hidden lg:w-full lg:flex">
            <ul className="menu horizontal flex-1 flex flex-row justify-between">
              <Links />
            </ul>
          </div>
        </div>
        {children}
      </div>
      {/* Side drawer on small screens */}

      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="flex p-4 overflow-y-auto menu w-80 bg-base-100 justify-between">
          <Links />
        </ul>
      </div>
    </div>
  );
};

export default Header;
