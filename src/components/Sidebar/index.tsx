"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { GrDashboard } from "react-icons/gr";
import { BiSolidBox, BiSolidBadgeCheck , BiUserPlus, BiLogoCreativeCommons, BiSolidGasPump  } from "react-icons/bi";
import { CiCalculator1, CiChat2 } from "react-icons/ci";

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
        role: ["ADM"],
        children: [
          { label: "Users", role: ["ADM"], privilege: "can view users", route: "/user-management/users" },
          { label: "Roles", role: ["ADM"], privilege: "can view roles", route: "/user-management/roles" },
          { label: "Privileges", role: ["ADM"], privilege: "can view privileges", route: "/user-management/privileges" },
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
        role: ["ADM"],
        children: [
          { label: "Calibration Parameters", role: ["ADM"], privilege: "can view parameters", route: "/master-management/parameters" },
          { label: "Calibration Item Group", role: ["ADM"], privilege: "can view item group", route: "/master-management/calibration" },
          { label: "Calibration Item", role: ["ADM"], privilege: "can view item", route: "/master-management/calibration-item" },
        ],
      },
      {
        icon: (
          <BiSolidGasPump className="fill-current" size={22} />
        ),
        label: "Product/Material Master",
        route: "#",
        role: ["ADM"],
        children: [
          { label: "Type of Sample", role: ["ADM"], privilege: "can view sample type", route: "/master-management/sample-test-type" },
          { label: "Test Type", role: ["ADM"], privilege: "can view test type", route: "/master-management/test-type" },
        ],
      },
      {
        icon: (
          <BiSolidBadgeCheck className="fill-current" size={22} />
        ),
        label: "Verification Master",
        route: "#",
        role: ["ADM"],
        children: [
          { label: "Fuel Outlet", role: ["ADM"], privilege: "can view fuel outlet",  route: "/master-management/fuel-outlet" },
        ],
      },
      {
        icon: (
          <BiLogoCreativeCommons  className="fill-current" size={22} />
        ),
        label: "Common Master",
        route: "#",
        role: ["ADM"],
        children: [
          { label: "Laboratory Testing Site", role: ["ADM"], privilege: "can view laboratory testing site",  route: "/master-management/laboratory-testing-site" },
          { label: "Dzongkhag", role: ["ADM"], privilege: "can view dzongkhag",  route: "/master-management/dzongkhag" },
          { label: "Client List", role: ["ADM"], privilege: "can view client list",  route: "/master-management/organization" },
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
        role: ["CHF", "DIR", "MLD", "VLD", "TLD", "FLD", "LLD", "PLD", "ADM", "CLO", "THT"],	
        children: [
          { label: "Application List", role: ["CHF", "DIR", "MLD", "VLD", "TLD", "FLD", "LLD", "PLD", "ADM"], privilege: "can view application list", route: "/applications-list" },
          { label: "Submit Application", role: ["THT", "ADM"], privilege: "can submit application", route: "/submit-applications" },
          { label: "Submitted Application", role: ["THT", "ADM"], privilege: "can submit application", route: "/submitted-application" },
          // { label: "Verify", role: "", privilege: "", route: "/ui/buttons" },
          { label: "Tested Report", role: ["ADM", "MLD", "VLD", "TLD", "FLD", "LLD", "PLD"], privilege: "can view test report", route: "/tested-application-list" },
          { label: "Approved Application", role: ["ADM", "CLO"], privilege: "can approved application", route: "/approved-application-list" },
          { label: "Tested Certificate", role: ["ADM", "DIR", "CHF"], privilege: "can view tested certificate", route: "/tested-certificate" },
        ],
      },
      {
        icon: (
          <BiSolidBox className="fill-current" size={22} />
        ),
        label: "Material Testing Services",
        route: "#",
        role: ["ADM","SRP","THT", "DIR"],
        children: [
          { label: "Submit Application", role: ["THT", "ADM"], route: "/product/submit-application" },
          { label: "Search Application", role: ["THT", "ADM", "SRP", "CLO", "DIR"], route: "/product/application-list" },
        ],
      },
      {
        icon: (
          <CiChat2 className="fill-current" size={22} />
        ),
        label: "Feedback Module",
        route: "#",
        role: ["ADM"],
        children: [
          { label: "Product/Material Feedbacks", role: [], route: "/material_feedback" },
          { label: "Calibration Feedbacks", role: [], route: "/calibration_feedback" },
          { label: "Submitted Feedbacks", role: [], route: "/ui/alerts" },
          // { label: "Buttons", route: "/ui/buttons" },
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
    const [storedRoles, setStoredRoles] = useState("");
  useEffect(() => {
    // Fetch stored user details from localStorage
    const storedUser = localStorage.getItem("userDetails");
    const roles = localStorage.getItem("roles");
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
    if(roles){
      const parsedRoles = Array.isArray(roles) ? roles : JSON.parse(roles);
      setStoredRoles(parsedRoles);
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
          {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
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
