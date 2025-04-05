"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Input from '@/components/Inputs/Input';
import { Form, Formik, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Eye, Download, ChevronDown, ChevronUp } from "lucide-react";

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

    const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false);
    const [isTestedDataOpen, setIsTestedDataOpen] = useState(false);  

    const toggleDeviceDetails = () => {
        setIsDeviceDetailsOpen(prev => !prev);
    };    
    const toggleTestedData = () => setIsTestedDataOpen(!isTestedDataOpen);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);
    const viewCertificate = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }
    
        if (!applicationDetails || !applicationDetails.deviceRegistry || applicationDetails.deviceRegistry.length === 0) {
            toast.error("Application details or device registry data is missing.");
            return;
        }
    
        const parameter = applicationDetails.deviceRegistry[0].parameter; // Fetching parameter dynamically
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibration/print/print`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationNumber: applicationNumber, 
                    parameter: parameter, // Passing the fetched parameter dynamically
                }),
            });
            console.log("This is the body being passed for certificate: ", applicationNumber, parameter);
            if (!response.ok) {
                throw new Error(`Failed to fetch certificate: ${response.statusText}`);
            }
    
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const newTab = window.open(blobUrl, "_blank");
            if (!newTab) {
                toast.error("Popup blocked! Allow popups for this site.");
            }
        } catch (error) {
            console.error("Error viewing certificate:", error);
            toast.error("Failed to view certificate.");
        }
    };  
    const downloadExcel = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }
        // Fetch UUID from the tested data state
        const uuid = testedData?.uuid;  // Ensure `testedData` contains the uuid
    
        if (!uuid) {
            toast.error("UUID is missing.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibration/workflow/downloadDocument/${uuid}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                toast.success("File downloaded successfully!"); // Success message when status is 200
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const newTab = window.open(blobUrl, "_blank");
                if (!newTab) {
                    toast.error("Popup blocked! Allow popups for this site.");
                }
            } else {
                throw new Error(`Failed to download the file: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download file.");
        }
    };
    const fetchEquipment = async (id: any) => {
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

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/calibration/calibrationForm/fetchByApplicationNo?applicationNumber=${applicationNumber}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": parsedUser?.id || "999",
                        "userName": parsedUser?.userName,
                    }
                }
            );

            const data = response.data.body.data;
            console.log("This is the application details: ", data);
            setApplicationDetails(data);
            fetchEquipment(data.deviceRegistry[0].testItemId);

        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    }, [applicationNumber, token]);

    useEffect(() => {
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
            const { userRole } = JSON.parse(storedUser);
            const roleList = [userRole[0].roles];
            const hasCLO = roleList.some((role: { code: string }) => role.code === "CLO");
            setIsOfficer(hasCLO);
        }
        fetchApplicationDetails();

    }, [applicationNumber, fetchApplicationDetails]);

    return (
        <>
            {/* First Card: Application and Device Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Application Details
                    </h2>

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
                    </div>
                </div>
                <br></br>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Device Details
                        </h2>
                        <Button
                        onClick={toggleDeviceDetails}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition"
                        variant="ghost"
                        >
                        {isDeviceDetailsOpen ? (
                            <>
                            Hide <ChevronUp size={18} />
                            </>
                        ) : (
                            <>
                            Show <ChevronDown size={18} />
                            </>
                        )}
                        </Button>
                    </div>

                    {/* Collapsible Content */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isDeviceDetailsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Equipment/Instrument */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Equipment/Instrument
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {equipment?.[0]?.description || "—"}
                            </div>
                        </div>

                        {/* Manufacturer/Type/Brand */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Manufacturer/Type/Brand
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.deviceRegistry?.[0]?.manufacturerOrTypeOrBrand || "—"}
                            </div>
                        </div>

                        {/* Range */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Range
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {equipment?.[0]?.range || "—"}
                            </div>
                        </div>

                        {/* Serial Number/Model */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Serial Number/Model
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.deviceRegistry?.[0]?.serialNumberOrModel || "—"}
                            </div>
                        </div>

                        {/* Rate */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Rate
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.deviceRegistry?.[0]?.rate || "—"}
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Amount
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                            {applicationDetails?.deviceRegistry?.[0]?.amount || "—"}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Second Card: Tested Data Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                {/* Header Section */}
                <div className="mb-4.5 flex flex-col xl:flex-row items-center justify-between">
                    <h1 className="text-lg font-bold">Tested Data Files</h1>
                    <div className="flex justify-end gap-4 p-4 bg-gray-100 rounded-lg shadow-md mb-4">
                    <Button
                        variant="default"
                        onClick={viewCertificate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Eye size={18} /> View Certificate
                    </Button>
                    <Button
                        variant="default"
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <Download size={18} /> Download Excel
                    </Button>
                </div>
            </div>
            <hr></hr>
            <br></br>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Tested Data
                </h2>
                <Button
                    onClick={() => setIsTestedDataOpen(!isTestedDataOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    variant="ghost"
                    >
                {isTestedDataOpen ? (
                    <>
                    Hide <ChevronUp size={18} />
                    </>
                ) : (
                    <>
                    Show <ChevronDown size={18} />
                    </>
                )}
                </Button>
            </div>
            {isTestedDataOpen && testedData && (
                <div className="overflow-x-auto space-y-6">
                    {/* Repeatability Data */}
                    <div>
                    <h2 className="text-md font-semibold mb-2">Repeatability Data</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Observation</th>
                            <th className="border px-4 py-2">Indicated Force (KN)</th>
                            <th className="border px-4 py-2">Average Relative Indication Error (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testedData.calibration_data['Indicated Force F(KN)'].map((force: number, index: number) => (
                            <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{force}</td>
                            <td className="border px-4 py-2">
                                {testedData.calibration_data['Average Relative Indication Error q (%)'][index]}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <hr />

                    {/* Linearity Data */}
                    <div>
                    <h2 className="text-md font-semibold mb-2">Linearity Data</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Indicated Force (KN)</th>
                            <th className="border px-4 py-2">Standard FPI Readings (Fi)</th>
                            <th className="border px-4 py-2">Temp Corrected Readings (Fit)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testedData.calibration_data['Indicated Force F(KN)'].map((force: number, index: number) => (
                            <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{force}</td>
                            <td className="border px-4 py-2">{testedData.calibration_data['Standard FPI readings in division Fi'][index]}</td>
                            <td className="border px-4 py-2">{testedData.calibration_data['Temp corrected reading in division Fit'][index]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <hr />

                    {/* Eccentricity Data */}
                    <div>
                    <h2 className="text-md font-semibold mb-2">Eccentricity Data</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Test Position</th>
                            <th className="border px-4 py-2">Test 1 Position 0° (F1)</th>
                            <th className="border px-4 py-2">Test 2 Position 180° (F2)</th>
                            <th className="border px-4 py-2">Test 3 Position 360° (F3)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testedData.calibration_data['Indicated Force F(KN)'].map((force: number, index: number) => (
                            <tr key={index} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{testedData.calibration_data['Test 1 position 0° F1'][index]}</td>
                            <td className="border px-4 py-2">{testedData.calibration_data['Test 2 position 180° F2'][index]}</td>
                            <td className="border px-4 py-2">{testedData.calibration_data['Test 3 position 360° F3'][index]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}
        </div>
        {/* New Section: Select Status, Remarks, and Update Button */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Update Status & Remarks
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {/* Status Dropdown */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Select Status
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="">-- Select Status --</option>
                            <option value="approve">Approve</option>
                            <option value="reject">Rejecte</option>
                            <option value="retest">Retest</option>
                        </select>
                    </div>
                    {/* Remarks Textarea */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Remarks
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter remarks..."
                        ></textarea>
                    </div>
                    {/* Update Button */}
                    <div>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailForm;
