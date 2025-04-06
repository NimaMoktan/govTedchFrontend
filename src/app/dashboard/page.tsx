"use client"
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";

type UserDetails = {
  fullName: string;
  email: string;
  imageUrl: string;
  roles: string[];  
};

export default function Home () {
  const [userDetails, setUserDetails] = useState<UserDetails>({
      fullName: "Loading...",
      email: "Loading...",
      imageUrl: "/images/user/default.jpg",
      roles: [],  
    });

  useEffect(() => {
      const storedUser = localStorage.getItem("userDetails");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userRoles = parsedUser.userRole?.map((role: { roles: { code: string } }) => role.roles.code) || [];
        setUserDetails({
          fullName: parsedUser.fullName,
          email: parsedUser.email,
          imageUrl: "/images/user/jigme.jpg",
          roles: userRoles,  
        });
      }
    }, []);

  return (
    <DefaultLayout>
      <h3>
        Welcome To {userDetails.roles.slice(0, 3)
          .map((role) => {
            const roleMap: Record<string, string> = {
              ADM: "Superadmin",
              DIR: "Director",
              THT: "Client",
              CHF: "Chief",
              CLO: "Calibration Officer",
              MLD: "Mass Lab Head",
              VLD: "Volume Lab Head",
              TID: "Temperature Lab Head",
              FID: "Force Lab Head",
              LID: "Length Lab Head",
              PID: "Force Pressure Head",
            };

            return roleMap[role] || "Unknown";
          })
          .join(" & ")} Dashboard
      </h3>
    </DefaultLayout>

  );
}
