"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { GrDashboard } from "react-icons/gr";
import { BiSolidBox, BiSolidBadgeCheck , BiUserPlus, BiLogoCreativeCommons, BiSolidGasPump  } from "react-icons/bi";
import { CiCalculator1, CiChat2 } from "react-icons/ci";
import { BsCardList } from "react-icons/bs";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[];  // Add roles here
};

interface SidebarProps {
  sidebarOpen: boolean | true;
  setSidebarOpen: (arg: boolean) => void;
}
const menuGroups = [
  {
    menuItems: [
      {
        icon: (
          <GrDashboard className="fill-current" size={22} />
        ),
        label: "Dashboard",
        route: "/dashboard",
      },
      {
        icon: (
          <BiUserPlus className="fill-current" size={22} /> 
        ),
        label: "User Management",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Users", route: "/user-management/users" },
          { label: "Roles", route: "/user-management/roles" },
          { label: "Privileges", route: "/user-management/privileges" },
        ],
      }
      
    ],
  },
  {
    name: "Master Management",
    menuItems: [
      {
        icon: (
          <CiCalculator1 className="fill-current" size={22} />
        ),
        label: "Calibration Master",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Calibration Parameters", route: "/master-management/parameters" },
          { label: "Calibration Item Group", route: "/master-management/calibration" },
          { label: "Calibration Item", route: "/master-management/calibration-item" },
        ],
      },
      {
        icon: (
          <BiSolidGasPump className="fill-current" size={22} />
        ),
        label: "Product/Material Master",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Type of Sample", route: "/master-management/sample-test-type" },
          { label: "Test Type", route: "/master-management/test-type" },
        ],
      },
      {
        icon: (
          <BiSolidBadgeCheck className="fill-current" size={22} />
        ),
        label: "Verification Master",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Fuel Outlet", route: "/master-management/fuel-outlet" },
        ],
      },
      {
        icon: (
          <BiLogoCreativeCommons  className="fill-current" size={22} />
        ),
        label: "Common Master",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Laboratory Testing Site", route: "/master-management/laboratory-testing-site" },
          { label: "Dzongkhag", route: "/master-management/dzongkhag" },
          { label: "Client List", route: "/master-management/organization" },
        ],
      },
      
    ],
  },
  {
    name: "Service Modules",
    menuItems: [
      {
        icon: (
          <CiCalculator1 className="fill-current" size={22} />
        ),
        label: "Calibration Services",
        route: "#",
        children: [
          { label: "Application List", route: "/applications-list" },
          { label: "Submit Application", route: "/submit-applications" },
          { label: "Verify", route: "/ui/buttons" },
          { label: "Tested Report", route: "/tested-application-list" },
          { label: "Submit Report", route: "/ui/buttons" },
          { label: "Approved Application", route: "/approved-application-list" },
          { label: "Tested Certificate", route: "/tested-certificate" },
        ],
      },
      {
        icon: (
          <BiSolidBox className="fill-current" size={22} />
        ),
        label: "Material Testing Services",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Alerts", route: "/ui/alerts" },
          { label: "Buttons", route: "/ui/buttons" },
        ],
      },
      {
        icon: (
          <CiChat2 className="fill-current" size={22} />
        ),
        label: "Feedback Module",
        route: "#",
        rolesAllowed: ["ADM"],
        children: [
          { label: "Product/Material Feedbacks", route: "/material_feedback" },
          { label: "Calibration Feedbacks", route: "/calibration_feedback" },
          { label: "Submitted Feedbacks", route: "/ui/alerts" },
          { label: "Buttons", route: "/ui/buttons" },
        ],
      },
    ],
  }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [userDetails, setUserDetails] = useState<UserDetails>({
      fullName: "Loading...",
      email: "Loading...",
      imageUrl: "/images/user/default.jpg",
      roles: [],  // Ensure roles is included in initial state
    });
  useEffect(() => {
    // Fetch stored user details from localStorage
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Extract roles from userRole array
      const userRoles = parsedUser.userRole?.map((role: { roles: { code: string } }) => role.roles.code) || [];
      // console.log("This is the user details: ", userRoles, storedUser);
      setUserDetails({
        fullName: parsedUser.fullName,
        email: parsedUser.email,
        imageUrl: "/images/user/jigme.jpg",
        roles: userRoles,  // Now this is valid
      });
    }
  }, []);
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-3 lg:py-3 bg-graydark">
          <Link href="/">
            <p className="text-white font-bold">Bhutan Standard Bureau</p>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block"
          >
            {/* <BsCardList className="text-white" size={26} onClick={() => setSidebarOpen(false)} /> */}
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-2 px-2 py-2 lg:mt-1 lg:px-2">
          {menuGroups
            .filter(group => 
              group.menuItems.some(item => 
                !item.rolesAllowed || 
                item.rolesAllowed.some(role => userDetails.roles.includes(role))
              )
            ) // Filters out menu groups that have no visible items
            .map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems
                    .filter(item => 
                      !item.rolesAllowed || 
                      item.rolesAllowed.some(role => userDetails.roles.includes(role))
                    )
                    .map((menuItem, menuIndex) => {
                      let filteredChildren: { label: string; route: string }[] = [];
                    
                      if (menuItem.children) {
                        filteredChildren = menuItem.children.filter((child, index) => {
                          const requiredRoles = ["THT", "MLD", "ADM"];
                          if (index === 1) {
                            return userDetails.roles.includes("THT")|| userDetails.roles.includes("ADM");
                          }
                          const labHead = ["LLD", "MLD", "VLD", "TLD", "FLD", "PLD", "ADM"]
                          if (index === 3) {
                            return labHead.some(role => userDetails.roles.includes(role)); 
                          }
                          if (index === 5) {
                            return userDetails.roles.includes("CLO") ;
                          }
                          const certificateView = ["CHF", "DIR", "ADM"];
                          if (index === 6) {
                            return certificateView.some(role => userDetails.roles.includes(role)); 
                          }
                          const constApplicationList = ["LLD", "MLD", "VLD", "TLD", "FLD", "PLD", "ADM", "CHF", "DIR"]
                          if (index === 0) {
                            return constApplicationList.some(role => userDetails.roles.includes(role)); 
                          }
                          // Other children (0, 2, 3) are for ADM & CHF
                          return userDetails.roles.includes("ADM");
                        });
                      }
                      return (
                        <SidebarItem
                          key={menuIndex}
                          item={{
                            ...menuItem,
                            children: filteredChildren.length > 0 ? filteredChildren : undefined,
                          }}
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

export default Sidebar;
