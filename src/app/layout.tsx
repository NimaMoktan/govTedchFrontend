import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoadingProvider } from "@/context/LoadingContext";
import { PermissionProvider } from "@/context/PermissionContext";
import { Metadata } from "next";
import { Suspense } from "react";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "1199 Citizen Services, PSDD",
  description: "Login page for 1199 Citizen Services, PSDD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-1 flex-col lg:ml-72.5">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main className="dark:bg-boxdark-2 dark:text-bodydark">
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10"> */}
        <Suspense fallback={<div>Loading...</div>}>
          <LoadingProvider>
            <PermissionProvider>{children}</PermissionProvider>
          </LoadingProvider>
        </Suspense>
        {/* </div>
              </main>
            </div>
          </div> */}
      </body>
    </html>
  );
}
