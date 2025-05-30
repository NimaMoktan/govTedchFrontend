"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { GrDashboard, GrTable } from "react-icons/gr";
import { BsCardList } from "react-icons/bs";
import { CiCalculator1, CiChat2 } from "react-icons/ci";
import { BsCupHot } from "react-icons/bs";

interface SidebarProps {
  sidebarOpen: boolean | true;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: <GrDashboard className="fill-current" size={22} />,
        label: "Dashboard",
        route: "/dashboard",
      },
    ],
  },

  {
    name: "Service Modules",
    menuItems: [
      {
        icon: <CiCalculator1 className="fill-current" size={22} />,
        label: "Calibration Services",
        route: "#",
        children: [
          { label: "Application List", route: "/applications-list" },
          { label: "Submit Application", route: "/submit-applications" },
        ],
      },
    ],
  },
];

const UserSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 bg-graydark px-6 py-2 lg:py-6.5">
          <Link href="/">
            <p className="font-bold text-white">1199 Citizen Services, PSDD</p>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block"
          >
            <GrTable className="text-white" size={26} />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-2 py-2 lg:mt-1 lg:px-2">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default UserSidebar;
