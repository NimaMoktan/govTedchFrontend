"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useCallback } from "react";

interface Application {
    id: number;
    applicationNumber: string;
    status: string;
    createdDate: string;
}
import Loader from "@/components/common/Loader";
import axios from "axios";


const ApplicationList: React.FC = () => {
    const [applicationList, setApplicatoinList] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);
    
    const loadItem = useCallback(async () => {
        setIsLoading(true);
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
        try {
            const list = await axios.get(`${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/populateWorkflowDtls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "userId": parsedUser.id,
                    "userName": parsedUser.userName,
                },
            });
            const { data } = list.data;
            console.log("This are the datas ma broder: ", data);
            setApplicatoinList(data || []);
        } catch (error) {
            console.error("Error fetching application list", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]); // ✅ Now it's stable and will only change when `token` changes.
    
    useEffect(() => {
        if (token) {
            loadItem();
        }
    }, [token, loadItem]); // ✅ Add `loadItem` to dependencies

    if (isLoading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
        <Breadcrumb pageName="Calibration Applications" />
        <div className="flex flex-col gap-2">
            <ToastContainer />
            <div className="rounded-sm border bg-white p-5 shadow-sm">
            <DataTable columns={columns} data={applicationList.filter(item => item.status === "Approved" || item.status === "Submitted" || item.status === "Rejected" || item.status === "Assigned to Calibration Officer")} />
            </div>
        </div>
        </DefaultLayout>
    );
};

export default ApplicationList;
