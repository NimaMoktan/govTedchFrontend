'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface ApplicationDetails {
    cid: string;
    clientName: string;
    contactNumber: string;
    emailAddress: string;
    deviceRegistry: { testItemId: string; manufacturerOrTypeOrBrand: string; rate?: string; amount?: string; serialNumberOrModel?: string, quantity?: string; }[];
    
}

const DetailForm: React.FC = () => {
    const [token] = useState<string | null>(localStorage.getItem("token"));
    const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
    const [equipment, setEquipment] = useState<{
        range: string; description: string 
}[]>([]);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");

    const fetchEquipment = async (id : any) => {
        const token = localStorage.getItem("token");
      
        if (!token) {
          return;
        }
      
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationItems/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }
      
          const data = await response.json();

          const filteredEquipment = data.data.filter((item: any) => item.id === id);
            setEquipment(filteredEquipment);


          if (!data || !Array.isArray(data.data)) {
            throw new Error("Invalid response format: Expected 'data' to be an array.");
          }
      
        } catch (error) {
          console.error("Error fetching equipment data:", error);
        }
      };

    const fetchApplicationDetails = async () => {
        // Fetch application details using applicationNumber calibration/calibrationForm/fetchByApplicationNo?applicationNumber
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calibration/calibrationForm/fetchByApplicationNo?applicationNumber=${applicationNumber}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "userId": parsedUser.id,
                    "userName": parsedUser.userName,
                }
            }
        ).then((res) => res.data);
        const { data } = response.body;
        setApplicationDetails(data);
        fetchEquipment(data.deviceRegistry[0].testItemId);
    }

    useEffect(() => {
        fetchApplicationDetails();

    }, [applicationNumber]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    <h1>Application Number : <strong>{applicationNumber?.toUpperCase()}</strong> </h1>
                    </label>
                </div>

            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        CID Number : <b>{applicationDetails?.cid}</b>
                    </label>
                </div>

                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Full Name : <b>{applicationDetails?.clientName}</b>
                    </label>
                </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Contact Number : <b>{applicationDetails?.contactNumber}</b>
                    </label>
                </div>

                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email Address : <b>{applicationDetails?.emailAddress}</b>
                    </label>
                </div>
            </div>
            <hr />
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 mt-3 block text-sm font-medium text-black dark:text-white">
                    <h1>Device Details </h1>
                    </label>
                </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Equipment/Instrument : <b>{equipment?.[0]?.description}</b>
                    </label>
                </div>

                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Manufacturer/Type/Brand : <b>{applicationDetails?.deviceRegistry[0].manufacturerOrTypeOrBrand}</b>
                    </label>
                </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Range : <b>{equipment?.[0]?.range}</b>
                    </label>
                </div>

                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Serial Number/Model : <b>{applicationDetails?.deviceRegistry[0].serialNumberOrModel}</b>
                    </label>
                </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Quantity : <b>{applicationDetails?.deviceRegistry[0].quantity}</b>
                    </label>
                </div>
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Rate : <b>{applicationDetails?.deviceRegistry[0].rate}</b>
                    </label>
                </div>

            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Amount : <b>{applicationDetails?.deviceRegistry[0].amount}</b>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DetailForm;