'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
// import { toast } from "react-toastify";
import Input from '@/components/Inputs/Input';
import Select from '@/components/Inputs/Select';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ApplicationDetails {
    id: string;
    cid: string;
    clientName: string;
    contactNumber: string;
    emailAddress: string;
    deviceRegistry: { testItemId: string; manufacturerOrTypeOrBrand: string; rate?: string; amount?: string; serialNumberOrModel?: string, quantity?: string; id?: number; }[];
}

const DetailForm: React.FC = () => {
    const [token] = useState<string | null>(localStorage.getItem("token"));
    const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
    const [equipment, setEquipment] = useState<{
        range: string; description: string
    }[]>([]);
    const [isChief, setIsChief] = useState<boolean | null>();
    const [isLabHead, setIsLabHead] = useState<boolean | null>();

    const searchParams = useSearchParams();
    const router = useRouter();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");
    const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false);    
    const toggleDeviceDetails = () => {
        setIsDeviceDetailsOpen(prev => !prev);
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
            // toast.success("Application status updated successfully", { position: "top-right", autoClose: 1000 });
            setTimeout(() => {
                router.push("/dashboard");

            }, 1000);
        }else{
            // toast.error("Failed to update application statu", { position: "top-right", autoClose: 1000 });
        }
    }

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
            console.log("This is the details: ", data);
            setApplicationDetails(data);
            fetchEquipment(data.deviceRegistry[0].testItemId);
    
        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    }, [applicationNumber, token]); // ✅ Dependencies included
    
    useEffect(() => {
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
            const { userRole } = JSON.parse(storedUser);
            const roleList = [userRole[0].roles];
            const hasCHF = roleList.some((role: { code: string }) => role.code === "CHF");
            const requiredRoles = ["MLD", "VLD", "TLD", "FLD", "LLD", "PLD", "DIR"]; // adding all the lab head role codes
            const hasDIT = roleList.some((role: { code: string }) => requiredRoles.includes(role.code));
            setIsChief(hasCHF);
            setIsLabHead(hasDIT);
        }
        fetchApplicationDetails();
    
    }, [applicationNumber, fetchApplicationDetails]); // ✅ Now safe to include fetchApplicationDetails

    return (
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
            <br></br>
            {isChief &&
            <Formik initialValues={{ status: "", remarks: "", applicationNumber: applicationNumber}} onSubmit={(values) => handleSubmit(values)}>
                <Form>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <Select label="Select Status" name="status" options={[{ value: "approve", text: "Approve" }, { value: "reject", text: "Reject" }]} onValueChange={() => console.log("Selection changed!")}  />
                    </div>
                    <div className="w-full xl:w-1/2">

                        <input name="applicationNumber" type="hidden" value={applicationNumber ?? ''}/>
                        <Input label="Remarks" name="remarks" />
                    </div>
                </div>
                <button type="submit" className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 justify-center">
                    Update
                </button>
                </Form>
            </Formik>
            }
            {isLabHead &&
            <Formik initialValues={{ status: "", remarks: "", applicationNumber: applicationNumber}} onSubmit={(values) => handleSubmit(values)}>
                <Form>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <Select 
                        label="Select Status" 
                        name="status" 
                        options={[{ value: "approve", text: "Approve"}, {value: "reject", text: "Reject"}, {value: "retest", text: "Retest"}]} 
                        onValueChange={() => console.log("Selection changed!")} />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <Select 
                        label="Select Calibration Officer" 
                        name="calibration_officer" 
                        options={[{ value: "Dorji Wangchuk", text: "Dorji Wangchuk"}, {value: "Pema Dorji", text: "Pema Dorji"}]} 
                        onValueChange={() => console.log("Selection changed!")} />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <input name="applicationNumber" type="hidden" value={applicationNumber ?? ''}/>
                        <Input label="Remarks" name="remarks" />
                    </div>
                </div>
                <button type="submit" className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 justify-center">
                    Update
                </button>
                </Form>
            </Formik>
            }

        </div>
    );
};

export default DetailForm;