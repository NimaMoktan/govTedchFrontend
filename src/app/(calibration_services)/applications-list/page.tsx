"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useCallback } from "react";
import api from "@/lib/axios";

interface Application {
    id: number;
    applicationNumber: string;
    status: string;
    createdDate: string;
}
import Loader from "@/components/common/Loader";


const ApplicationList: React.FC = () => {
    const [applicationList, setApplicationList] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
        try {
            const list = await api.get(`${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/populateWorkflowDtls`, {
                headers: {
                    "userId": parsedUser.id,
                    "userName": parsedUser.userName,
                },
            });
            console.log("Application List", list);
            const { data } = list.data;
            setApplicationList(data || []);
        } catch (error) {
            console.error("Error fetching application list", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
            loadItem();
    }, [loadItem]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
        <Breadcrumb pageName="Calibration Applications" />
        <div className="flex flex-col gap-2">
            <ToastContainer />
            <div className="rounded-sm border bg-white p-5 shadow-sm">
            <DataTable
                columns={columns}
                data={applicationList.filter(item => item.status === "Approved" || item.status === "Submitted" || item.status === "Rejected" || item.status === "Verified")}
                />            
            </div>
        </div>
        </DefaultLayout>
    );
};

export default ApplicationList;
