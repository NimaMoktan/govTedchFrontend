/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Swal from 'sweetalert2';

interface ApplicationDetails {
    id: string;
    deviceRegistry: { testItemId: string; manufacturerOrTypeOrBrand: string; rate?: string; amount?: string; serialNumberOrModel?: string, quantity?: string; id?: number; }[];
}

const DetailForm: React.FC = () => {
    const [applicationDetails, setApplicationDetails] = useState<any | null>(null);
    const [equipment, setEquipment] = useState<{
            range: string; description: string
        }[]>([]);
    const [isOfficer, setIsOfficer] = useState<boolean | null>(null);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter(); 
    const [testedData, setTestedData] = useState<any | null>(null);

    const [, setIsDeviceDetailsOpen] = useState(false);
    const [isTestedDataOpen, setIsTestedDataOpen] = useState(false);  

    const toggleDeviceDetails = () => {
        setIsDeviceDetailsOpen(prev => !prev);
    };    
    const toggleTestedData = () => setIsTestedDataOpen(!isTestedDataOpen);
    const extractAndFilterParameter = (applicationNumber: string) => {
        // Step 1: Split the application number to extract the parameter
        const parts = applicationNumber.split("/");
        const parameter = parts[1]; // Extract the second part
    };
    
    const handleSubmit = async(values: any) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        const data = {
            id: applicationDetails?.id,
            applicationNumber: values.applicationNumber,
            userId: parsedUser.id,
            userName: parsedUser.userName,
            status: values.status
        }
        console.log("These is the sent data: ", data);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/${id}/updateWorkflow`,data,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "userId": parsedUser.id,
                    "userName": parsedUser.userName,
                }
            }
        );
        if(response.status === 200){
            // SweetAlert to notify the user of success
            Swal.fire({
                title: 'Success!',
                text: 'Application status updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/dashboard");
                }
            });
        }else{
            // toast.error("Failed to update application statu", { position: "top-right", autoClose: 1000 });
        }
    }
    const viewCertificate = async () => {
        // Step 1: Validate token
        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }
    
        // Step 2: Validate application details and device registry
        if (
            !applicationDetails ||
            !applicationDetails.deviceRegistry ||
            applicationDetails.deviceRegistry.length === 0
        ) {
            toast.error("Application details or device registry data is missing.");
            return;
        }
    
        // Step 3: Extract parameter dynamically
        const parameter = applicationDetails.deviceRegistry[0].parameter;
    
        try {
            // Step 4: Make API request to fetch the certificate
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibration/print/print`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationNumber: applicationNumber,
                    parameter: parameter, // Pass the dynamically fetched parameter
                }),
            });
    
            console.log("Request Body for Certificate:", { applicationNumber, parameter });
    
            // Step 5: Handle non-OK responses
            if (!response.ok) {
                const errorMessage = `Failed to fetch certificate: ${response.statusText}`;
                console.error(errorMessage);
                toast.error("Failed to fetch certificate.");
                return;
            }
    
            // Step 6: Process the response as a blob
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
    
            // Step 7: Open the blob in a new tab
            const newTab = window.open(blobUrl, "_blank");
            if (!newTab) {
                toast.error("Popup blocked! Please allow popups for this site.");
            }
        } catch (error) {
            console.error("Error viewing certificate:", error);
            toast.error("An unexpected error occurred while fetching the certificate.");
        }
    };
    
    const downloadExcel = async () => {
        // Step 1: Validate token
        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }
    
        // Step 2: Validate UUID from testedData state
        const uuid = testedData?.uuid; // Ensure `testedData` contains the UUID
        if (!uuid) {
            toast.error("UUID is missing.");
            return;
        }
    
        try {
            // Step 3: Make API request to download the Excel file
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/calibration/workflow/downloadDocument/${uuid}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Step 4: Handle non-OK responses
            if (!response.ok) {
                const errorMessage = `Failed to download file: ${response.statusText}`;
                console.error(errorMessage);
                toast.error("Failed to download the file.");
                return;
            }
    
            // Step 5: Process the response as a blob
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
    
            // Step 6: Open the blob in a new tab
            const newTab = window.open(blobUrl, "_blank");
            if (!newTab) {
                toast.error("Popup blocked! Please allow popups for this site.");
            } else {
                toast.success("File downloaded successfully!");
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("An unexpected error occurred while downloading the file.");
        }
    };
    const fetchEquipment = async (id: any) => {

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

            const storedUser = localStorage.getItem("userDetails");
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const testedDetails = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/flask/calibration/api/read-file/${applicationNumber}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        userId: parsedUser.id,
                        userName: parsedUser.userName,
                    },
                }
            );
            if (!testedDetails.ok) {
                throw new Error(`API request failed: ${testedDetails.status} ${testedDetails.statusText}`);
            }
            const testedData = await testedDetails.json();
            setTestedData(testedData); // Store fetched data in state
            const data = await response.json();
            const filteredEquipment = data.data.filter((item: any) => item.id === id);
            setEquipment(filteredEquipment);
            console.log("This is the tested data: ", testedData);
        } catch (error) {
            console.error("Error fetching equipment data:", error);
        }
    };  
    
    const fetchApplicationDetails = useCallback(async () => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const storeToken = localStorage.getItem("token"); // Retrieve the token dynamically
    
        if (!storeToken) {
            console.error("Authentication token is missing!");
            toast.error("Authentication token is missing!", { position: "top-right" });
            return;
        }
    
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/calibration/calibrationForm/fetchByApplicationNo?applicationNumber=${applicationNumber}`,
                {
                    headers: {
                        "Authorization": `Bearer ${storeToken}`, // Use the dynamically retrieved token
                        "Content-Type": "application/json",
                        "userId": parsedUser?.id || "999",
                        "userName": parsedUser?.userName,
                    },
                }
            );
            const data = response.data.body.data;
            console.log("This is the application details: ", data);
            setApplicationDetails(data);
            fetchEquipment(data.deviceRegistry[0].testItemId);
        } catch (error) {
            console.error("Error fetching application details:", error);
    
            // Handle specific error cases
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "An error occurred.";
                toast.error(`Failed to fetch application details: ${errorMessage}`, { position: "top-right" });
            } else {
                toast.error("An unexpected error occurred.", { position: "top-right" });
            }
        }
    }, [applicationNumber, fetchEquipment]);

    useEffect(() => {
        const storedUser = localStorage.getItem("userDetails");
        const storeToken = localStorage.getItem("token")
        setToken(storeToken)
        if (storedUser) {
            const { userRole } = JSON.parse(storedUser);
            const roleList = [userRole[0].roles];
            const hasCLO = roleList.some((role: { code: string }) => role.code === "CLO");
            setIsOfficer(hasCLO);
        }
        fetchApplicationDetails();

    }, [applicationNumber]);

    return (
        <>
            {/* First Card: Application and Device Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Application Number */}
                        <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Application Number
                        </label>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                            {applicationNumber?.toUpperCase() || "—"}
                        </div>
                        </div>

                        {/* CID Number */}
                        <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            CID Number
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.cid || "—"}
                        </div>
                        </div>

                        {/* Full Name */}
                        <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Full Name
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.clientName || "—"}
                        </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Contact Number
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.contactNumber || "—"}
                        </div>
                        </div>

                        {/* Email Address */}
                        <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Email Address
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.emailAddress || "—"}
                        </div>
                        </div>
                        <Button
                        variant="default"
                        onClick={viewCertificate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Eye size={18} /> View Certificate
                    </Button>
                    </div>
                </div>
                <br></br>
            </div>
        </>
    );
};

export default DetailForm;
