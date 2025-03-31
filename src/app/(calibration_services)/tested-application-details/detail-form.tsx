"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Input from '@/components/Inputs/Input';
import { Form, Formik, Field } from 'formik';
import { useRouter } from 'next/navigation';

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
                `${process.env.NEXT_PUBLIC_API_URL}/calibration/api/read-file/NML/WM/03-2025/0456`,
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
                <button
                    onClick={async () => {
                        const token = localStorage.getItem("token"); // Get token from localStorage

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
                                    applicationNumber: "NML/F/03-2025/0460",
                                    parameter: "Force",
                                }),
                            });

                            if (!response.ok) {
                                throw new Error(`Failed to fetch certificate: ${response.statusText}`);
                            }

                            const blob = await response.blob();
                            const blobUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

                            // Open in a new tab
                            window.open(blobUrl, "_blank");

                        } catch (error) {
                            console.error("Error downloading certificate:", error);
                            toast.error("Failed to download/view certificate.");
                        }
                    }}
                    className="w-1/6 rounded bg-primary p-3 text-white font-medium hover:bg-opacity-90"
                >
                    Download/View Certificate
                </button>


            </div>
            {testedData ? (
                <div className="overflow-x-auto space-y-6">
                    <hr></hr>
                    {/* Repeatability Table */}
                    <div>
                        <h2 className="text-md font-semibold mb-2">Repeatability Data</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Observation</th>
                                    <th className="border px-4 py-2">Load (g)</th>
                                    <th className="border px-4 py-2">Indication (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testedData.calibration_data.repeatability.load_g.map((load: number, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{testedData.calibration_data.repeatability.no_of_observations[index]}</td>
                                        <td className="border px-4 py-2">{load}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.repeatability.indication_g[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <hr></hr>
                    {/* Linearity Table */}
                    <div>
                        <h2 className="text-md font-semibold mb-2">Linearity Data</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Nominal Mass (g)</th>
                                    <th className="border px-4 py-2">Certified Mass (g)</th>
                                    <th className="border px-4 py-2">Correction (g)</th>
                                    <th className="border px-4 py-2">Difference (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testedData.calibration_data.linearity.nominal_mass_g.map((mass: number, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{mass}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.linearity.certified_mass_g[index]}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.linearity.correction_g[index]}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.linearity.difference_g[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <hr></hr>
                    {/* Eccentricity Table */}
                    <div>
                        <h2 className="text-md font-semibold mb-2">Eccentricity Data</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Load (g)</th>
                                    <th className="border px-4 py-2">Indication (g)</th>
                                    <th className="border px-4 py-2">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testedData.calibration_data.eccentricity.load_g.map((load: number, index: number) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{load}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.eccentricity.indication_g[index]}</td>
                                        <td className="border px-4 py-2">{testedData.calibration_data.eccentricity.location[index]}</td>
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
