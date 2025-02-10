"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { DataTable } from "./table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

interface SampleType {
    id: number;
    code: string;
    role_name: string;
    privileges: string[]; // Add this line
    active: string;
}
interface FormValues {
    id?: number; // Add this line
    code: string;
    role_name: string;
    privileges: string[]; // Assuming privilege IDs are strings
    active: string; // Assuming this is a string like "Y" or "N"
}
const SampleTestType: React.FC = () => {
    const [sampleType, setSampleType] = useState<SampleType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false);
    const [editingRole, setEditingRole] = useState<FormValues | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [selectedRole, setSelectedRole] = useState<FormValues | null>(null);
    const [privileges, setPrivileges] = useState<{ id: string; name: string }[]>([]);
    const [roles, setRoles] = useState<{ code: string; role_name: string }[]>([]);
    const router = useRouter();

    const showModalHandler = () => {
        
        setShowModal(prev => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false)
    };
    const toggleModal = () => {
        setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
        setIsEditing(false);
        setEditingRole(null);
    };
    const handleLoadPrivileges = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/privileges/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
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
        
    const loadServices = () => {
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/roles/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data != null) {
                    setSampleType(data.data);
                } else {
                    setSampleType([])
                }
                setIsLoading(false)
            })
            .catch((err) => toast.error(err.message, { position: "top-right" }));
    };

    // const handleEdit = (role : FormValues) => {
    //     setIsEditing(true)
    //     setSelectedRole(role);
    //     setShowModal(prev => (prev === "hidden" ? "block" : "hidden"));
    // }
    

    const handleSubmit = async (values: FormValues, resetForm: () => void) => {
        const privilegesFormatted = values.privileges.map((privilegeId) => ({
            id: Number(privilegeId),
        }));
    
        // Determine the API URL and HTTP method based on whether it's editing or creating
        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/core/roles/${selectedRole?.id}/update`
            : `${process.env.NEXT_PUBLIC_API_URL}/core/roles/`;
    
        const method = "POST"; // Always POST in both cases
    
        const Payload = JSON.stringify({
            code: values.code,
            role_name: values.role_name,
            active: values.active,
            privileges: privilegesFormatted,
        });
    
        try {
            let response;
            let privilegesResponse;
    
            if (isEditing) {
                // If editing, prepare update Payload with existing privileges from selectedRole
                const updatePrivilegesFormatted = selectedRole?.privileges.map((privilege) => ({
                    id: privilege
                }));
                const updatePayload = {
                    code: values.code,
                    role_name: values.role_name,
                    active: values.active,
                    privileges: updatePrivilegesFormatted,
                };  
    
                // Make both API requests in parallel
                [response, privilegesResponse] = await Promise.all([
                    fetch(url, {
                        method,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatePayload),
                    }),
                    fetch(url, {
                        method,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatePayload),
                    }),
                ]);
    
                // Process responses
                const responseData = await response.json();
                const privilegesResponseData = await privilegesResponse.json();
    
                console.log("Response Data:", responseData);
                console.log("Privileges Response Data:", privilegesResponseData);
    
                if (privilegesResponseData.statusCode !== 200) {
                    throw new Error(privilegesResponseData.message);
                }
            } else {
    
                response = await fetch(url, {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: Payload,
                });
            }
            if (response.ok) {
                Swal.fire({
                    title: isEditing ? "Role Updated!" : "Role Created!",
                    text: isEditing
                        ? "The role has been updated successfully."
                        : "The role has been created successfully.",
                    icon: "success",
                    confirmButtonText: "Great, Thanks!",
                    confirmButtonColor: "#4caf50", // Green color for success
                    allowOutsideClick: false, // Prevent closing when clicking outside
                }).then(() => {
                    router.push("/user-management/roles");
                });
                resetForm();
                showModalHandler();
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: "Oops! Something went wrong",
                    text: errorData?.message || "Please try again later.",
                    icon: "error",
                    confirmButtonText: "Retry",
                    confirmButtonColor: "#f44336", // Red color for error
                    allowOutsideClick: false, // Prevent closing when clicking outside
                });
            }  
        } catch (error) {
            console.error("Unexpected Error:", error);
            toast.error("An unexpected error occurred. Please try again.", {
                position: "top-right",
                autoClose: 1000,
            });
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };    

    const handleDelete = (role : FormValues) => {
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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/core/roles/${role.id}/delete`,
                    {},
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                console.log("This is the role ID: ", role.id);
                const { data } = response;
                if (data.statusCode == 200) {
                    Swal.fire("Deleted!", "The role has been deleted.", "success").then(()=>{
                        router.push("/user-management/roles");
                    });
                } else {
                    toast.error(data.message,
                        { position: "top-right", autoClose: 1000 }
                    );
                }
            }
        });
    };

    const handleEdit = (role : FormValues) => {
        setSelectedRole(role);
        // setEditingRole(role);
        setIsEditing(true);
        setShowModal("block");
    };

    useEffect(() => {
        if (token) {
            loadServices();
            handleLoadPrivileges();
        }
    }, [isEditing]);

    if (isLoading) {
        return <Loader />
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Type of Roles" />
            <div className="flex flex-col gap-2">
                <ToastContainer />
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                    <div
                        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100 ${showModal === "block" ? "block" : "hidden"
                            }`}
                    >
                        <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
                        <Formik<FormValues>
                            initialValues={{
                                code: selectedRole?.code || "",
                                role_name: selectedRole?.role_name || "",
                                privileges: selectedRole?.privileges.map((privilege) => privilege.toString()) || [], // Make sure privileges are strings
                                active: selectedRole?.active || "Y", // Default to "Y" for active
                            }}
                            validationSchema={Yup.object({
                                code: Yup.string().required("Role code is required"),
                                role_name: Yup.string().required("Role name is required"),
                            })}
                            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                            enableReinitialize={true} // This will make sure the form is reinitialized when selectedRole changes
                            >
                            {({ values, handleChange, handleBlur, setFieldValue }) => (
                                <Form>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isEditing ? "Edit Role" : "Create New Role"}
                                    </h3>
                                    <div className="mb-4 mt-4">

                                    <Input label="Role Code" type="text" placeholder="Enter role code" name="code" />
                                    </div>
                                    <div className="mb-4">
                                    <Input label="Role Name" type="text" placeholder="Enter role name" name="role_name" />
                                    </div>
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

                                    {/* <div className="mt-4">
                                    <label className="block text-gray-700 dark:text-white mb-2">Assign Privileges</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {privileges.map((privilege) => (
                                        <div key={privilege.id} className="flex items-center">
                                            <input
                                            type="checkbox"
                                            name="privileges"
                                            value={privilege.id.toString()} // Ensure that this matches the data type (string)
                                            id={`privilege-${privilege.id}`}
                                            checked={values.privileges.includes(privilege.id.toString())} // Same here
                                            onChange={() => {
                                                const newPrivileges = values.privileges.includes(privilege.id.toString())
                                                ? values.privileges.filter((id: string) => id !== privilege.id.toString())
                                                : [...values.privileges, privilege.id.toString()];
                                                setFieldValue("privileges", newPrivileges); // Update the selected privileges
                                            }}
                                            onBlur={handleBlur}
                                            className="mr-2"
                                            />
                                            <label htmlFor={`privilege-${privilege.id}`} className="text-gray-700 dark:text-white">
                                            {privilege.name}
                                            </label>
                                        </div>
                                        ))}
                                    </div>
                                    </div> */}

                                    <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={showModalHandler}
                                        className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg"
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">
                                        Save
                                    </button>
                                    </div>
                                </div>
                                </Form>
                            )}
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
