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
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Upload Report File
                                </label>
                                <input
                                    name="report_file"
                                    type="file"
                                    accept=".xls, .xlsx"
                                    className="form-control"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        setFieldValue("report_file", file); // Set the file value in Formik
                                        console.log("File selected:", file); // Check the file in the console
                                    }}
                                />
                            </div>
                            <div className="w-full xl:w-1/2">
                                <Input label="Remarks" name="remarks" />
                            </div>
                        </div>
            
                        <div className="mb-4.5 flex justify-start">
                            <button
                                type="submit"
                                className="w-1/6 rounded bg-primary p-3 text-white font-medium hover:bg-opacity-90"
                            >
                                Upload File
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
            )}
            {isOfficer && (
                <button onClick={() => handleSubmit()} className="w-1/3 bg-primary p-3 text-white rounded mt-4">
                    Update
                </button>
            )}
        </div>
    );
};

export default DetailForm;
