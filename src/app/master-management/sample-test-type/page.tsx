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

interface SampleType {
    id: number;
    code: string;
    description: string;
    active: string
}

const SampleTestType: React.FC = () => {
    const [sampleType, setSampleType] = useState<SampleType[]>([]);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false)
    const [editingService, setEditingService] = useState<SampleType | null>(null);
    const [token, setToken] = useState<string | null>();

    const toggleModal = () => {
        setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false);
        setEditingService(null);
    };

    const loadServices = (storeToken: string | null) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/SampleTestType/`, {
            headers: {
                Authorization: `Bearer ${storeToken}`,
                "userId": "999",
                "userName": parsedUser.userName,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data != null) {
                    setSampleType(data.data);
                } else {
                    setSampleType([])
                }
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));
    };

    const handleSubmit = (values: { code: string; description: string; active: string }, resetForm: () => void) => {

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/core/SampleTestType/${editingService?.id}/update`
            : `${process.env.NEXT_PUBLIC_API_URL}/core/SampleTestType/`;

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
                    loadServices(token || "");
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

    const handleDelete = (sample: SampleType) => {
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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/core/SampleTestType/${sample.id}/delete`,
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
                        loadServices(token || "");
                    }, 2000)
                } else {
                    toast.error(data.message,
                        { position: "top-right", autoClose: 1000 }
                    );
                }
            }
        });
    };

    const handleEdit = (sample: SampleType) => {
        setEditingService(sample);
        setIsEditing(true);
        setShowModal("block");
    };

    useEffect(() => {
        const storeToken = localStorage.getItem("token")
        setToken(storeToken)
        loadServices(storeToken);

    }, [isEditing]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Type of Sample" />
            <div className="flex flex-col gap-2">
                <ToastContainer />
                <div className="rounded-sm border bg-white p-5 shadow-sm">

                    <div
                        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${showModal === "block" ? "block" : "hidden"
                            }`}
                    >
                        <div className="bg-white p-6 rounded-md shadow-lg p-4 w-full max-w-5xl max-h-full">
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    code: editingService?.code || "",
                                    description: editingService?.description || "",
                                    active: editingService?.active || "Y"
                                }}
                                validationSchema={Yup.object({
                                    code: Yup.string().required("Code is required"),
                                    description: Yup.string().required("Description is required"),
                                })}
                                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                            >
                                <Form>

                                    <div className="mb-4">
                                        <Input label="Code" name="code" type="text" placeholder="Enter code" disabled={isEditing}/>
                                    </div>
                                    <div className="mb-4">
                                        <Input
                                            label="Description"
                                            name="description"
                                            type="text"
                                            placeholder="Enter description"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <Select
                                            onValueChange={() => { }}
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
                    <DataTable columns={columns(handleEdit, handleDelete)} data={sampleType} handleAdd={toggleModal} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SampleTestType;
