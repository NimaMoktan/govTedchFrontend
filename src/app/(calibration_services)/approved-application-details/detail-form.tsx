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
    const [fileUploaded, setFileUploaded] = useState(false); // Track if a file is uploaded
    const [fileName, setFileName] = useState<string | null>(null); // State to hold the file name

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
            setApplicationDetails(data);
            fetchEquipment(data.deviceRegistry[0].testItemId);

        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    }, [applicationNumber, token]);

    const handleFileUpload = async (values: any, { setSubmitting }: any) => {
        const file = values.report_file;
        const applicationNumber = applicationDetails?.applicationNumber
        if (!file || !(file instanceof File)) {
            toast.error("Please select a valid file!", { position: "top-right" });
            return;
        }
        const formData = new FormData();
        formData.append("File", file);
        formData.append("applicationNumber", applicationNumber);
        formData.append("itemName", equipment?.[0]?.description);
    
        try {
            const url = `${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/uploadDocFile`;
            const response = await axios.post(url, formData, {
                headers: { "Authorization": `Bearer ${token}` },
            });
    
            if (response.status === 200) {
                toast.success("File uploaded successfully!", { position: "top-right" });
                setFileUploaded(true); // ✅ Set file uploaded status
            } else {
                toast.error("File upload failed!", { position: "top-right" });
            }
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast.error("An error occurred during file upload.", { position: "top-right" });
        } finally {
            setSubmitting(false);
        }
    };   
    // Prevent update if no file has been uploaded
    const handleSubmit = async () => {
        if (!fileUploaded) {
            toast.error("Please upload a file before updating!", { position: "top-right" });
            return;
        }
    
        if (!applicationDetails) {
            toast.error("Application details not loaded!", { position: "top-right" });
            return;
        }
    
        if (!id) {
            toast.error("Invalid application ID!", { position: "top-right" });
            return;
        }
    
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
        const data = {
            id: applicationDetails?.id || id, // Ensure ID is passed
            applicationNumber: applicationDetails?.applicationNumber || "string", // Avoid undefined values
            userId: parsedUser?.id || 999,
            userName: parsedUser?.userName || "Unknown",
            status: applicationDetails?.status || "Pending", // Default status if missing
            assignedUser: "string",
            parameter: "string",
            createdDate: new Date().toISOString(), // Ensure valid timestamp
        };
    
        console.log("Submitting Data:", data); // Debugging
    
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/${id}/updateWorkflow`,
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": parsedUser?.id || "999",
                        "userName": parsedUser?.userName || "Unknown",
                    },
                }
            );
    
            if (response.status === 200) {
                toast.success("Application status updated successfully", { position: "top-right", autoClose: 1000 });
                setTimeout(() => router.push("/approved-application-list"), 1000);
            } else {
                toast.error("Failed to update application status", { position: "top-right", autoClose: 1000 });
            }
        } catch (error) {
            console.error("Error updating application status:", error);
            toast.error("An error occurred during update.", { position: "top-right" });
        }
    };
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            {/* Application Number */}
            <div className='mb-3'>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Application Number
                </label>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {applicationNumber?.toUpperCase() || "—"}
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-3">
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

            {/* Render Form to Upload File */}
            {isOfficer && (
                <Formik
                initialValues={{ report_file: null, remarks: "" }}
                onSubmit={handleFileUpload}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Upload Report File
                            </label>
                            <div className="relative">
                                <input
                                name="report_file"
                                type="file"
                                accept=".xls, .xlsx"
                                id="file-upload"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    setFileName(file ? file.name : null); // Set the file name when a file is selected
                                    setFieldValue("report_file", file);
                                    console.log("File selected:", file);
                                }}
                                />
                                <label
                                htmlFor="file-upload"
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-300"
                                >
                                Choose File
                                </label>
                            </div>
                            {/* Display the selected file name */}
                            {fileName && (
                                <p className="mt-2 text-sm text-gray-500">{fileName}</p>
                            )}
                            </div>
                    
                            <div className="w-full xl:w-1/2">
                            <Input label="Remarks" name="remarks" />
                            </div>
                        </div>
                    
                        <div className="mb-4.5 flex justify-start">
                            <button
                            type="submit"
                            className="w-1/4 rounded-lg bg-green-600 p-4 text-white font-bold hover:bg-green-900 transition-all duration-300"
                            >
                            Upload File
                            </button>
                        </div>
                    </Form>
                    )}
                </Formik>
            )}

            {/* Button to Update */}
            {isOfficer && (
                <button
                    onClick={() => handleSubmit()}
                    className="w-1/3 bg-primary p-3 text-white rounded mt-4"
                >
                    Update
                </button>
            )}
        </div>
    );
};

export default DetailForm;
