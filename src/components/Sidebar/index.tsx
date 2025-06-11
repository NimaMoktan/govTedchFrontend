"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image";
import { GrDashboard } from "react-icons/gr";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { IoIosInformationCircle } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiShapeFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

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
  roles: string[];
};

interface SidebarProps {
  sidebarOpen: boolean;
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
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Gender",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/gender",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Status",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/status",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Category",
            role: ["ADM"],
            privilege: "can view item",
            route: "/master-management/category",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
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
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Users",
            role: ["ADM"],
            privilege: "can view users",
            route: "/user-management/users",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Roles",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/user-management/roles",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Permission",
            role: ["ADM"],
            privilege: "can view Permission",
            route: "/user-management/permission",
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
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Calls",
            role: ["ADM"],
            privilege: "can view users",
            route: "/task-management/calls",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
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
        label: "Notice Management",
        route: "#",
        role: ["ADM"],
        children: [
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "Noticeboard",
            role: ["ADM"],
            privilege: "can view users",
            route: "/notice-management/noticeboard",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "G2C Information",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/notice-management/g2c-information",
          },
          {
            icon: <RiShapeFill size={16} className="mr-2" />,
            label: "GovTech Helpdesk",
            role: ["ADM"],
            privilege: "can view roles",
            route: "/notice-management/govtech-helpdesk",
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
        route: "/faq-management",
        role: ["ADM"],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const router = useRouter();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "Loading...",
    email: "Loading...",
    imageUrl: "/images/user/default.jpg",
    roles: [],
  });
  const [storedRoles, setStoredRoles] = useState("");
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    const roles = localStorage.getItem("roles");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userRoles =
        parsedUser.userRole?.map(
          (role: { roles: { code: string } }) => role.roles.code,
        ) || [];
      setUserDetails({
        fullName: parsedUser.fullName,
        email: parsedUser.email,
        imageUrl: "/images/user/jigme.jpg",
        roles: userRoles,
      });
    }
    if (roles) {
      const parsedRoles = Array.isArray(roles) ? roles : JSON.parse(roles);
      setStoredRoles(parsedRoles);
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedMenu(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuToggle = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
    setPageName(label.toLowerCase());
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userDetails");
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 block rounded-md bg-gray-700 p-2 text-white lg:hidden"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-y-hidden bg-gray-700 duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
            collapsed ? "w-20" : "w-72"
          } ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-2 bg-red-700 px-6 py-3 lg:py-3 ${collapsed ? "justify-center" : ""}`}
          >
            {!collapsed && (
              <>
                <Image
                  width={32}
                  height={32}
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                />
                <Link href="/">
                  <p className="font-bold text-white">1199 Citizen Services</p>
                </Link>
              </>
            )}

            {collapsed && (
              <div className="flex items-center justify-center">
                <Image
                  width={32}
                  height={32}
                  src={"/images/logo/logo.png"}
                  alt="Logo"
                  className="mx-auto"
                />
              </div>
            )}

            <button
              onClick={toggleSidebar}
              aria-controls="sidebar"
              className="hidden text-white lg:block"
            >
              {collapsed ? (
                <IoIosArrowForward size={26} />
              ) : (
                <IoIosArrowBack size={26} />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white lg:hidden"
            >
              <IoIosArrowBack size={26} />
            </button>
          </div>

          <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto duration-300 ease-linear">
            <nav className="mt-1 px-2 py-1 lg:mt-0 lg:px-1">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <ul className="mb-0 flex flex-col gap-1">
                    {group.menuItems.map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={{
                          ...menuItem,
                          children: menuItem.children,
                        }}
                        collapsed={collapsed}
                        assignRoles={storedRoles}
                        roles={menuItem.role}
                        pageName={pageName}
                        setPageName={setPageName}
                        isExpanded={expandedMenu === menuItem.label}
                        onToggle={() => handleMenuToggle(menuItem.label)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom menu for Settings and Logout */}
          <div className="border-t border-gray-600 p-4">
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-gray-600 ${
                    pageName === "settings" ? "bg-gray-600" : ""
                  }`}
                  onClick={() => setPageName("settings")}
                >
                  <FaCog size={22} />
                  {!collapsed && <span>Settings</span>}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className={`group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-white duration-300 ease-in-out hover:bg-gray-600 ${
                    pageName === "logout" ? "bg-gray-600" : ""
                  }`}
                >
                  <FaSignOutAlt size={22} />
                  {!collapsed && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </ClickOutside>
    </>
  );
};

export default Sidebar;
