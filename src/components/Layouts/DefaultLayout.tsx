"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useLoading } from "@/context/LoadingContext";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("/")
      ) {
        setIsLoading(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setIsLoading]);

  useEffect(() => {
    // Once the path has changed, stop loading
    setIsLoading(false);
  }, [pathname, setIsLoading]);

  return (
    <>
      <div className="flex">
        <Toaster />
        <ToastContainer />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-x-hidden lg:ml-72.5">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 dark:bg-gray-500 md:p-6 2xl:p-5">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
