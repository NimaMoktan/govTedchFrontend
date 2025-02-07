"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "./table";
import { columns } from "./columns";

interface Application {
    id: string;
    applicationNumber: string;
    active: string;
}
import Loader from "@/components/common/Loader";
import axios from "axios";


const ApplicationList: React.FC = () => {
    const [applicationList, setApplicatoinList] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const loadItem = async () => {
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
        console.log(data);
        setApplicatoinList(data);
        } catch (error) {
        console.error("Error fetching application list", error);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
        loadItem();
        }
    }, [token]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
        <Breadcrumb pageName="Calibration Applications" />
        <div className="flex flex-col gap-2">
            <ToastContainer />
            <div className="rounded-sm border bg-white p-5 shadow-sm">
            <DataTable columns={columns} data={applicationList} />
            </div>
        </div>
        </DefaultLayout>
    );
};

export default ApplicationList;
