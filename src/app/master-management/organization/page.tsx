"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from "@/components/Inputs/Select";
import { DataTable } from "./table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";

interface OrganizationItem {
    id: number;
    description: string;
    address: string;
    contact: string;
    email: string;
    active: string
}

const OrganizationPage: React.FC = () => {
    const [services, setServices] = useState<OrganizationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false);
    const [editingService, setEditingService] = useState<OrganizationItem | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const toggleModal = () => {
        setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false);
        setEditingService(null);
    };

    const loadServices = () => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/clientList/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data != null) {
                    setServices(data.data);
                } else {
                    setServices([])
                }
                setIsLoading(false)
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));
    };

    const handleSubmit = (values: { address: string; description: string; email: string; contact: string; active: string }, resetForm: () => void) => {

        setIsLoading(true);

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/core/clientList/${editingService?.id}/update`
            : `${process.env.NEXT_PUBLIC_API_URL}/core/clientList/`;

        const method = isEditing ? "POST" : "POST";

        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => {
                if (res.ok) {

                    toast.success(
                        isEditing ? "Service updated successfully" : "Service created successfully",
                        { position: "top-right", autoClose: 1000 }
                    );
                    loadServices();
                    toggleModal();
                    resetForm();
                } else {
                    toast.error(
                        isEditing ? "Service updated successfully" : "Service created successfully",
                        { position: "top-right", autoClose: 1000 }
                    );
                    throw new Error("Failed to save service");
                }
            })
            .catch((err) => toast.error(err.message, { position: "top-right", autoClose: 1000 }));
    };

    const handleDelete = (service: OrganizationItem) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/core/clientList/${service.id}/delete`,
                    {},
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                const { data } = response;
                if (data.statusCode == 200) {
                    toast.success(data.message, { position: "top-right", autoClose: 1000 });

                    setTimeout(() => {
                        loadServices();
                    }, 2000)
                } else {
                    toast.error(data.message,
                        { position: "top-right", autoClose: 1000 }
                    );
                }
            }
        });
    };

    const handleEdit = (service: OrganizationItem) => {
        setEditingService(service);
        setIsEditing(true);
        setShowModal("block");
    };

    useEffect(() => {
        if (token) {
            loadServices();
        }
    }, [isEditing]);

    if (isLoading) {
        return <Loader />
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Client List" />
            <div className="flex flex-col gap-10">
                <ToastContainer />
                <div className="rounded-sm border bg-white p-5 shadow-sm">

                    <div
                        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${showModal === "block" ? "block" : "hidden"
                            }`}
                    >
                        <div className="bg-white p-6 rounded-md shadow-lg p-4 w-full max-w-5xl max-h-full">
                            <Formik
                                initialValues={{
                                    description: editingService?.description || "",
                                    address: editingService?.address || "",
                                    email: editingService?.email || "",
                                    contact: editingService?.contact || "",
                                    active: editingService?.active || "Y"
                                }}
                                validationSchema={Yup.object({
                                    description: Yup.string().required("Description is required"),
                                    address: Yup.string().required("Address is required"),
                                    contact: Yup.string().required("Contact is required"),
                                    email: Yup.string().required("Email is required"),
                                })}
                                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                            >
                                <Form>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label="Client Name"
                                                name="description"
                                                type="text"
                                                placeholder="Enter client name"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label={`Address`}
                                                name="address"
                                                type="text"
                                                placeholder="Enter client address" />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        
                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label="Contact"
                                                name="contact"
                                                type="text"
                                                placeholder="Enter client contact"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label={`Email`}
                                                name="email"
                                                type="email"
                                                placeholder="Enter Client Email" />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <Select
                                            label="Status"
                                            name="active"
                                            options={[{
                                                value: "Y",
                                                text: "YES"
                                            },
                                            {
                                                value: "N",
                                                text: "NO"
                                            }]}
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={toggleModal}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                    <DataTable columns={columns(handleEdit, handleDelete)} data={services} handleAdd={toggleModal} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default OrganizationPage;
