"use client"
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { BiUserPlus } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface FormValues {
    code: string;
    role_name: string;
    privileges: string[]; // Assuming privilege IDs are strings
    active: string; // Assuming this is a string like "Y" or "N"
}

const RolesPage: React.FC = () => {
    const [showModal, setShowModal] = useState("hidden");
    const [roles, setRoles] = useState<{ code: string; role_name: string }[]>([]);
    const [privileges, setPrivileges] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<FormValues | null>(null);

    const showModalHandler = (role: FormValues | null = null) => {
        setSelectedRole(role);
        console.log("This is the selected role: ", role); // Log the role directly
        setShowModal(prev => (prev === "hidden" ? "block" : "hidden"));
    };

    const handleSubmit = async (values: FormValues, resetForm: () => void) => {
        const privilegesFormatted = values.privileges.map((privilegeId) => ({
            id: Number(privilegeId),
        }));

        const payload = JSON.stringify({
            code: values.code,
            role_name: values.role_name,
            active: values.active,
            privileges: privilegesFormatted,
        });

        try {
            let response;
            if (selectedRole.id != null) {
                const updatePrivilegesFormatted = selectedRole.privileges.map((privilege) => ({
                    id: privilege.id,
                    code: privilege.code,
                    name: privilege.name,
                    active: privilege.active,
                }));
            
                // The payload now has the structure you're aiming for
                const updatePayload = {
                    code: values.code,
                    role_name: values.role_name,
                    active: values.active,
                    privileges: updatePrivilegesFormatted, // No need to map here, we already formatted the privileges
                };
                // Log the data to check the correct structure
                console.log("Data being sent to the API:", JSON.stringify(updatePayload, null, 2));
            
                // Now send the payload via the fetch request
                response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/roles/${selectedRole.id}/update`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2OTc3MDUsImV4cCI6MTczNzczMzcwNX0.VMUSsvDJ1KM4xPvFZ3slWWA9TSK9smv92H6A73G-Vj4", // Replace with your actual token
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatePayload),
                    }
                );
            } else {
                // Create new role
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2OTc3MDUsImV4cCI6MTczNzczMzcwNX0.VMUSsvDJ1KM4xPvFZ3slWWA9TSK9smv92H6A73G-Vj4", // Replace with correct token
                        "Content-Type": "application/json",
                    },
                    body: payload,
                });
            }

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: selectedRole ? "Role updated successfully!" : "Role created successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                    }).then(() => {
                    // Reload the page after the success message
                    window.location.reload();
                    });
                    resetForm();
                    showModalHandler();
                    handleLoadRoles();
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorData?.message || "Something went wrong. Please try again.",
                    });
                }              
        } catch (error) {
            console.error("Unexpected Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An unexpected error occurred. Please try again.",
            });
        }
    };

    const handleLoadRoles = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2OTQyNDUsImV4cCI6MTczNzczMDI0NX0.4_KeFJW8AgejTAjuIHOctvQnBJiWjrICQNK0W9dqZjw", // Replace with correct token
                },
            });

            if (!res.ok) {
                toast.error("Failed to fetch roles.");
                return;
            }

            const response = await res.json();
            if (response?.data && Array.isArray(response.data)) {
                setRoles(response.data);
            } else {
                toast.error("Invalid response data.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching roles.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadPrivileges = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/privileges/`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2OTQyNDUsImV4cCI6MTczNzczMDI0NX0.4_KeFJW8AgejTAjuIHOctvQnBJiWjrICQNK0W9dqZjw", // Replace with correct token
                },
            });

            if (!res.ok) {
                toast.error("Failed to fetch privileges.");
                return;
            }

            const response = await res.json();
            if (response?.data && Array.isArray(response.data)) {
                setPrivileges(response.data);
            } else {
                toast.error("Invalid response data.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching privileges.");
        }
    };

    useEffect(() => {
        handleLoadRoles();
        handleLoadPrivileges();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Roles" />
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="flex max-w-full justify-between items-center mb-5 ">
                        <h1 className="dark:text-white">Role List</h1>
                        <button
                            onClick={showModalHandler}
                            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-4"
                        >
                            <BiUserPlus className="text-white" size={20} /> Add Role
                        </button>
                    </div>

                    <div
                        className={`${showModal} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}
                    >
                        <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
                        <Formik<FormValues>
                            initialValues={{
                                code: selectedRole?.code || "",
                                role_name: selectedRole?.role_name || "",
                                privileges: selectedRole?.privileges || [],
                                active: selectedRole?.active || "Y", // Default to "Y" for active
                            }}
                            validationSchema={Yup.object({
                                code: Yup.string().required("Role code is required"),
                                role_name: Yup.string().required("Role name is required"),
                            })}
                            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                            enableReinitialize={true}  // This will make sure the form is reinitialized when selectedRole changes
                        >
                            {({ values, handleChange, handleBlur, setFieldValue }) => (
                                <Form>
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {selectedRole ? "Edit Role" : "Create New Role"}
                                        </h3>
                                        <Input
                                            label="Role Code"
                                            type="text"
                                            placeholder="Enter role code"
                                            name="code"
                                        />
                                        <Input
                                            label="Role Name"
                                            type="text"
                                            placeholder="Enter role name"
                                            name="role_name"
                                        />
                                        <div className="flex flex-col">
                                            <label htmlFor="active" className="block text-gray-700 dark:text-white mb-2">
                                                Status
                                            </label>
                                            <Field
                                                as="select"
                                                name="active"
                                                id="active"
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            >
                                                <option value="Y">Active</option>
                                                <option value="N">Inactive</option>
                                            </Field>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-gray-700 dark:text-white mb-2">
                                                Assign Privileges
                                            </label>
                                            <div className="grid grid-cols-6 gap-2">
                                                {privileges.map((privilege) => (
                                                    <div key={privilege.id} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            name="privileges"
                                                            value={privilege.id}
                                                            id={`privilege-${privilege.id}`}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`privilege-${privilege.id}`} className="text-gray-700 dark:text-white">
                                                            {privilege.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={showModalHandler}
                                                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto border-2">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th className="px-4 py-2">SL</th>
                                    <th className="px-4 py-2">Code</th>
                                    <th className="px-4 py-2">Role Name</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{role.code}</td>
                                        <td className="border px-4 py-2">{role.role_name}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => showModalHandler(role)} className="text-blue-500 hover:text-blue-700">
                                                    <BsPencil size={18} />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => console.log("Delete role")} // Add your delete logic
                                                >
                                                    <BsTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default RolesPage;
