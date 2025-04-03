"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Input from '@/components/Inputs/Input';
import { Form, Formik, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface ApplicationDetails {
    id: string;
    deviceRegistry: { testItemId: string; manufacturerOrTypeOrBrand: string; rate?: string; amount?: string; serialNumberOrModel?: string, quantity?: string; id?: number; }[];
}

const DetailForm: React.FC = () => {
    const [applicationDetails, setApplicationDetails] = useState<any | null>(null);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [isOfficer, setIsOfficer] = useState<boolean | null>(null);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter(); 
    const [testedData, setTestedData] = useState<any | null>(null);

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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibration/print/print`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    applicationNumber: "NML/F/04-2025/0486",
                    parameter: "Force",
                }),
            });
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
                `${process.env.NEXT_PUBLIC_API_URL}/flask/calibration/api/read-file/NML/F/04-2025/0486`,
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
            console.log("This is the tested data: ", testedData);
            const data = await response.json();
            const filteredEquipment = data.data.filter((item: any) => item.id === id);
            setEquipment(filteredEquipment);

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
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            <h1>Application Number : <strong>{applicationNumber?.toUpperCase()}</strong> </h1>
                        </label>
                    </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 mt-3 block text-sm font-medium text-black dark:text-white">
                            <h1><b>Device Details</b></h1>
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
                            Manufacturer/Type/Brand : <b>{applicationDetails?.deviceRegistry[0]?.manufacturerOrTypeOrBrand}</b>
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
                            Serial Number/Model : <b>{applicationDetails?.deviceRegistry[0]?.serialNumberOrModel}</b>
                        </label>
                    </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Quantity : <b>{applicationDetails?.deviceRegistry[0]?.quantity}</b>
                        </label>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Rate : <b>{applicationDetails?.deviceRegistry[0]?.rate}</b>
                        </label>
                    </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Amount : <b>{applicationDetails?.deviceRegistry[0]?.amount}</b>
                        </label>
                    </div>
                </div>
            </div>

            {/* Second Card: Tested Data Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5 mt-2">
            {/* Header Section */}
            <div className="mb-4.5 flex flex-col xl:flex-row items-center justify-between">
                <h1 className="text-lg font-bold">Tested Data Details</h1>
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
            {testedData ? (
                <div className="overflow-x-auto space-y-6">
                    <hr />
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
                                        <td className="border px-4 py-2">{testedData.calibration_data['Average Relative Indication Error q (%)'][index]}</td>
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
            ) : (
                <p className="text-gray-500">No tested data available.</p>
            )}

        </div>

        </>
    );
};

export default DetailForm;
