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

interface CalibrationItem {
    id: number;
    code: string;
    description: string;
    range: string;
    charges: number;
    test: string;
    calibration_group_id: number,
    active: string;
    calibrationGroup: any
}
interface Parameters {
    value: number;
    text: string;
}

const CalibrationItemGroup: React.FC = () => {
    const [itemGroup, setItemGroup] = useState<CalibrationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false);
    const [editingGroup, setEditingGroup] = useState<CalibrationItem | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [parameter, setParameter] = useState<Parameters[]>([])

    const toggleModal = () => {
        setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false);
        setEditingGroup(null);
    };

    const loadItem = () => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibrationItems/`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
                setIsLoading(false)
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));
    };

    const handleSubmit = (values: { 
        code: string; 
        description: string; 
        range: string;
        charges: number;
        test: string;
        calibration_group_id: number }, resetForm: () => void) => {

        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/calibrationItems/${editingGroup?.id}/update`
            : `${process.env.NEXT_PUBLIC_API_URL}/calibrationItems/`;

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
                    return res.json()
                } else {
                    toast.error(
                        isEditing ? "Service updated successfully" : "Service created successfully",
                        { position: "top-right", autoClose: 1000 }
                    );
                    throw new Error("Failed to save service");
                }
            }).then((response) =>{
                toast.success(response.messsage,
                    { position: "top-right", autoClose: 1000 }
                );
                loadItem();
                toggleModal();
                resetForm();
            })
            .catch((err) => toast.error(err.message, { position: "top-right", autoClose: 1000 }));
    };

    const handleDelete = (itemGroup: CalibrationItem) => {
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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/calibrationItems/${itemGroup.id}/delete`,
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
                        loadItem();
                    }, 2000)
                } else {
                    toast.error(data.message,
                        { position: "top-right", autoClose: 1000 }
                    );
                }
            }
        });
    };

    const handleEdit = (item: CalibrationItem) => {
        console.log(item)
        setEditingGroup(item);
        setIsEditing(true);
        setShowModal("block");
    };

    useEffect(() => {
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibrationGroup/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

                        setParameter([{ value: '', text: 'Select Parameter' }, ...paramOptions]);

                    } else {
                        setParameter([])
                    }
                    setIsLoading(false)
                })
                .catch((err) => toast.error(err.message, { position: "top-right" }));
            loadItem();
        }
    }, [isEditing]);

    if (isLoading) {
        return <Loader />
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Calibration Item" />
            <div className="flex flex-col gap-2">
                <ToastContainer />
                <div className="rounded-sm border bg-white p-5 shadow-sm">

                    <div
                        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${showModal === "block" ? "block" : "hidden"
                            }`}
                    >
                        <div className="bg-white p-6 rounded-md shadow-lg p-4 w-full max-w-5xl max-h-full">
                            <Formik
                                initialValues={{
                                    code: editingGroup?.code || "",
                                    description: editingGroup?.description || "",
                                    range: editingGroup?.range || "",
                                    charges: editingGroup?.charges || "",
                                    test: editingGroup?.test || "",
                                    calibration_group_id: editingGroup?.calibration_group_id || "",
                                    active: editingGroup?.active || "Y",
                                }}
                                validationSchema={Yup.object({
                                    code: Yup.string().required("Code is required"),
                                    description: Yup.string().required("Description is required"),
                                    range: Yup.string().required("Range is required"),
                                    charges: Yup.string().required("Charage is required"),
                                    test: Yup.string().required("Test is required"),
                                    calibration_group_id: Yup.number().required("Item Group is required"),
                                })}
                                onSubmit={(values, { resetForm }) => handleSubmit({
                                    ...values,
                                    charges: Number(values.charges),
                                    calibration_group_id: Number(values.calibration_group_id)
                                }, resetForm) } >
                                <Form>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                    <Input label="Code" name="code" type="text" placeholder="Enter code" />
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
                                    <Input label="Range" name="range" type="text" placeholder="Enter Range" />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                    <Input
                                            label="Charges"
                                            name="charges"
                                            type="text"
                                            placeholder="Enter Charges"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                    <Input
                                            label="Test"
                                            name="test"
                                            type="text"
                                            placeholder="Enter Test"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                    <Select
                                            label="Group Item"
                                            name="calibration_group_id"
                                            options={parameter}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
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

                                    <div className="w-full xl:w-1/2">
                                    
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

export default CalibrationItemGroup;
