"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { GrDashboard } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { IoIosInformationCircle } from "react-icons/io";

import {
  BiSolidBox,
  BiSolidBadgeCheck,
  BiUserPlus,
  BiLogoCreativeCommons,
  BiSolidGasPump,
} from "react-icons/bi";
import { CiCalculator1, CiChat2 } from "react-icons/ci";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[]; // Add roles here
};

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
      {
        icon: <FaDatabase className="fill-current" size={22} color="#ffd166" />,
        label: "Data Management",
        route: "#",
        role: ["ADM"],
        children: [
          {
            label: "Gender",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/gender",
          },

          {
            label: "Status",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/status",
          },
          {
            label: "Category",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/category",
          },
          {
            label: "Dzongkhag",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/dzongkhag",
          },
        ],
      },
      {
        icon: <FaUser className="fill-current" size={22} color="#ec782b" />,
        label: "User Management",
        route: "#",
        role: ["ADM"],
        children: [
          {
            label: "Users",
            role: ["ADM"],
            privilege: "can view users",
            route: "/user-management/users",
          },
          {
            label: "Roles",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/user-management/roles",
          },
          {
            label: "Privileges",
            role: ["ADM"],
            privilege: "can view privileges",
            route: "/user-management/privileges",
          },
        ],
      },

      {
        icon: <FaTasks className="fill-current" size={22} color="#55cd00" />,
        label: "Task Management",
        route: "#",
        role: ["ADM"],
        children: [
          {
            label: "Calls",
            role: ["ADM"],
            privilege: "can view users",
            route: "/task-management/calls",
          },
          {
            label: "Emails",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/task-management/emails",
          },
        ],
      },
      {
        icon: (
          <IoIosInformationCircle
            className="fill-current"
            size={22}
            color="#46cfef"
          />
        ),
        label: "Information",
        route: "#",
        role: ["ADM"],
        children: [
          {
            label: "Noticeboard",
            role: ["ADM"],
            privilege: "can view users",
            route: "/information/noticeboard",
          },
          {
            label: "G2C Information",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/information/g2c-information",
          },
          {
            label: "GovTech Helpdesk",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/information/govtech-helpdesk",
          },
        ],
      },
      {
        icon: (
          <LuMessagesSquare
            className="fill-current"
            size={22}
            color="#e96976"
          />
        ),
        label: "FAQ",
        route: "/faq",
        role: ["ADM"],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "Loading...",
    email: "Loading...",
    imageUrl: "/images/user/default.jpg",
    roles: [], // Ensure roles is included in initial state
  });
  const [storedRoles, setStoredRoles] = useState("");
  useEffect(() => {
    // Fetch stored user details from localStorage
    const storedUser = localStorage.getItem("userDetails");
    const roles = localStorage.getItem("roles");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Extract roles from userRole array
      const userRoles =
        parsedUser.userRole?.map(
          (role: { roles: { code: string } }) => role.roles.code,
        ) || [];
      // console.log("This is the user details: ", userRoles, storedUser);
      setUserDetails({
        fullName: parsedUser.fullName,
        email: parsedUser.email,
        imageUrl: "/images/user/jigme.jpg",
        roles: userRoles, // Now this is valid
      });
    }
    if (roles) {
      const parsedRoles = Array.isArray(roles) ? roles : JSON.parse(roles);
      setStoredRoles(parsedRoles);
    }
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gray-700 duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 bg-red-700 px-6 py-3 lg:py-3">
          <Image
            width={32}
            height={32}
            src={"/images/logo/logo.png"}
            alt="Logo"
          />
          <Link href="/">
            <p className="font-bold text-white">1199 Citizen Services</p>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block"
          >
            <IoIosArrowBack
              className="text-white"
              size={26}
              onClick={() => setSidebarOpen(true)}
            />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-2 py-2 lg:mt-1 lg:px-2">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3> */}
                <ul className="mb-6 flex flex-col gap-1.5 text-white">
                  {group.menuItems.map((menuItem, menuIndex) => {
                    return (
                      <SidebarItem
                        key={menuIndex}
                        item={{
                          ...menuItem,
                          children: menuItem.children,
                        }}
                        assignRoles={storedRoles}
                        roles={menuItem.role}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    );
                  })}
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

export default Sidebar;
