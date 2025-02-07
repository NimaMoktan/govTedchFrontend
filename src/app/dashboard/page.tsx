"use client"
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[];  // Add roles here
};

export default function Home () {
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
        console.log("This is the user details: ", userRoles, storedUser);
        setUserDetails({
          fullName: parsedUser.fullName,
          email: parsedUser.email,
          imageUrl: "/images/user/jigme.jpg",
          roles: userRoles,  // Now this is valid
        });
      }
    }, []);
  return (
    <>
    <DefaultLayout>
        {/* <ECommerce /> */}
          {userDetails.roles.includes("ADM") && (
            <h3>Welcome To Superadmin Dashboard</h3>
          )}
          {userDetails.roles.includes("TNT") && (
            <h3>Welcome To Client Dashboard</h3>
          )}
          {userDetails.roles.includes("CHF") && (
            <h3>Welcome To Chief Dashboard</h3>
          )}
          {userDetails.roles.includes("CLO") && (
            <h3>Welcome To Calibration Officer Dashboard</h3>
          )}
          {userDetails.roles.includes("LHD") && (
            <h3>Welcome To Lab Head/Engineer Dashboard</h3>
          )}
          {userDetails.roles.includes("DIT") && (
            <h3>Welcome To Director Dashboard</h3>
          )}
    </DefaultLayout>
    </>
  );
}