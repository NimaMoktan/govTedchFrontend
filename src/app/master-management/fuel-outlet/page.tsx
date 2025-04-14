/* eslint-disable react-hooks/exhaustive-deps */
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

interface OutLetItem {
    id: number;
    code: string;
    description: string;
    no_pumps: string;
    location: string;
    dzongkhagId: number;
    quantity: number;
    rate: number;
    active: string;
}
interface Dzongkhag {
    value: number;
    text: string;
}

const FuelOutLet: React.FC = () => {
    const [itemGroup, setItemGroup] = useState<OutLetItem[]>([]);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false);
    const [editingGroup, setEditingGroup] = useState<OutLetItem | null>(null);
    const [token, setToken] = useState<string | null>();
    const [dzoList, setDzoList] = useState<Dzongkhag[]>([])

    const toggleModal = () => {
        setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false);
        setEditingGroup(null);
    };

    const loadItem = (token: string) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/outlet/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "userId": parsedUser.id,
                "userName": parsedUser.userName,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data != null) {
                    setItemGroup(data.data);
                } else {
                    setItemGroup([])
                    toast.error(data.message, { position: "top-right", autoClose: 1000 })
                }
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));
    };

    const handleSubmit = (values: {
        code: string;
        description: string;
        no_pumps: string;
        location: string;
        quantity: number;
        rate: number;
        dzongkhagId: number;
    }, resetForm: () => void) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/core/outlet/${editingGroup?.id}/update`
            : `${process.env.NEXT_PUBLIC_API_URL}/core/outlet/`;

        const method = isEditing ? "POST" : "POST";

        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "userId": parsedUser.id,
                "userName": parsedUser.userName,
            },
            body: JSON.stringify(values),
        })
            .then((res) => {

                if (res.ok) {
                    return res.json()
                } else {
                    toast.error(
                        isEditing ? "Service updated successfully" : "Service created successfully",
                        { position: "top-right", autoClose: 1000 }
                    );
                    throw new Error("Failed to save service");
                }
            }).then((response) => {
                toast.success(response.messsage,
                    { position: "top-right", autoClose: 1000 }
                );
                setTimeout(() => {
                    loadItem(token || "");
                }, 2000)
                toggleModal();
                resetForm();
            })
            .catch((err) => toast.error(err.message, { position: "top-right", autoClose: 1000 }));
    };

    const handleDelete = (itemGroup: OutLetItem) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/core/outlet/${itemGroup.id}/delete`,
                    {},
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "userId": parsedUser.id,
                            "userName": parsedUser.userName,
                        }
                    }
                );
                const { data } = response;
                if (data.statusCode == 200) {
                    toast.success(data.message, { position: "top-right", autoClose: 1000 });

                    setTimeout(() => {
                        loadItem(token || "");
                    }, 2000)
                } else {
                    toast.error(data.message,
                        { position: "top-right", autoClose: 1000 }
                    );
                }
            }
        });
    };

    const handleEdit = (item: OutLetItem) => {
        setEditingGroup(item);
        setIsEditing(true);
        setShowModal("block");
    };

    useEffect(() => {
        const storeToken = localStorage.getItem("token")
        setToken(storeToken)
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/dzongkhag/`, {
            headers: {
                Authorization: `Bearer ${storeToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data != null) {
                    const list = data.data;

                    const paramOptions = list?.map((param: { id: number; description: string }) => ({
                        value: param.id,  // Use string values for consistency
                        text: param.description,
                    }));
                    setDzoList(paramOptions);

                } else {
                    setDzoList([])
                }
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));

        loadItem(storeToken || "");

    }, [isEditing]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Fuel Outlet" />
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
                                    code: editingGroup?.code || "",
                                    description: editingGroup?.description || "",
                                    no_pumps: editingGroup?.no_pumps || "",
                                    location: editingGroup?.location || "",
                                    dzongkhagId: editingGroup?.location || "",
                                    quantity: editingGroup?.quantity || "",
                                    rate: editingGroup?.rate || "",
                                    active: editingGroup?.active || "Y",
                                }}
                                validationSchema={Yup.object({
                                    code: Yup.string().required("Code is required"),
                                    description: Yup.string().required("Description is required"),
                                    no_pumps: Yup.string().required("Number of is required"),
                                    location: Yup.string().required("Location is required"),
                                    dzongkhagId: Yup.string().required("Dzongkhag is required"),
                                    quantity: Yup.string().required("Number of nozzles is required"),
                                    rate: Yup.string().required("Rate is required")
                                })}
                                onSubmit={(values, { resetForm }) => {
                                    handleSubmit(
                                        {
                                            ...values,
                                            quantity: Number(values.quantity),
                                            rate: Number(values.rate),
                                            dzongkhagId: Number(values.dzongkhagId)
                                        },
                                        resetForm
                                    );
                                }} >
                                <Form>
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <Input label="Code" name="code" type="text" placeholder="Enter code" disabled={isEditing} />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label="Description"
                                                name="description"
                                                type="text"
                                                placeholder="Enter description"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <Input label="Number of Pumps" name="no_pumps" type="number" placeholder="Enter Number of Pumps" />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label="Location"
                                                name="location"
                                                type="text"
                                                placeholder="Enter Location Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <Input label="Number of nozzles" name="quantity" type="number" placeholder="Enter number of nozzles" />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                                label="Rate"
                                                name="rate"
                                                type="text"
                                                placeholder="Enter Rate"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <Select
                                                onValueChange={() => { }}
                                                label="Dzongkhag"
                                                name="dzongkhagId"
                                                options={dzoList}
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
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
                    <DataTable columns={columns(handleEdit, handleDelete)} data={itemGroup} handleAdd={toggleModal} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FuelOutLet;
