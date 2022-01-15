import React from "react";
import { MenuIcon } from "@heroicons/react/solid";
type SidebarProps = {
  children?: React.ReactNode;
};
const Sidebar = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return <div className="rounded-lg shadow bg-base-200 drawer h-12"></div>;
};

export default Sidebar;
