'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Input from '@/components/Inputs/Input';
import Select from '@/components/Inputs/Select';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';

interface ApplicationDetails {
    id: string;
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
    const [isChief, setIsChief] = useState<boolean | null>();

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");

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

        const response = await axios.post(`${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/${applicationDetails?.id}/updateWorkflow`,data,
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
            toast.success("Application status updated successfully", { position: "top-right", autoClose: 1000 });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }else{
            toast.error("Failed to update application statu", { position: "top-right", autoClose: 1000 });
            
        }

    }

    const fetchApplicationDetails = async () => {
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
        const storedUser = localStorage.getItem("userDetails");
        if (storedUser) {
            const { userRole } = JSON.parse(storedUser);
            const roleList = [userRole[0].roles];
            const hasCHF = roleList.some((role: { code: string }) => role.code === "CHF");
            setIsChief(hasCHF);

        }
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
            {isChief &&
            <Formik initialValues={{ status: "", remarks: "", applicationNumber: applicationNumber}} onSubmit={(values) => handleSubmit(values)}>
                <Form>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <Select label="Select Status" name="status" options={[{ value: "Verified", text: "Verify" }, { value: "reject", text: "Reject" }]} />
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