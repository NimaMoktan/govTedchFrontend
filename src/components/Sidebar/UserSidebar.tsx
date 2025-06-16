"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

const SidebarItem = ({ item, pageName, setPageName, assignRoles }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Initialize state based on current path
  useEffect(() => {
    setMounted(true);
    if (item.children) {
      const shouldExpand = item.children.some(
        (child: any) => child.route === pathname,
      );
      setIsExpanded(shouldExpand);
      if (shouldExpand) {
        setPageName(item.label.toLowerCase());
      }
    }
  }, [pathname, item.children, setPageName]);

  // Clear loading state after navigation
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
    };

    router.events?.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  const isActive = useCallback(
    (menuItem: any): boolean => {
      if (menuItem.route === pathname) return true;
      if (menuItem.children) {
        return menuItem.children.some((child: any) => isActive(child));
      }
      return false;
    },
    [pathname],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // If we're already navigating, ignore additional clicks
      if (isNavigating) return;

      // If this is a parent item with children
      if (item.children) {
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        setPageName(newExpandedState ? item.label.toLowerCase() : "");
        return;
      }

      // If we're already on this page
      if (pathname === item.route) {
        return;
      }

      // For regular navigation
      setIsNavigating(true);
      router.push(item.route, {
        // Use shallow routing only if we're staying within the same page group
        shallow: pathname.split("/")[1] === item.route.split("/")[1],
      });
    },
    [isExpanded, isNavigating, item, pathname, router, setPageName],
  );

  if (!mounted) return null;

  const isItemActive = isActive(item);
  const shouldRotate = item.children && isExpanded;

  return (
    <li>
      <Link
        href={item.route}
        prefetch={true}
        onClick={handleClick}
        className={`${
          isItemActive ? "bg-graydark dark:bg-meta-4" : ""
        } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
          isNavigating ? "cursor-wait opacity-70" : ""
        }`}
      >
        {item.icon}
        {item.label}
        {item.children && (
          <svg
            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-300 ${
              shouldRotate ? "rotate-180" : ""
            }`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        )}
        {isNavigating && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2">
            Loading...
          </span>
        )}
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-screen" : "hidden max-h-0"
          }`}
        >
          <SidebarDropdown item={item.children} assignRoles={assignRoles} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
