"use client";
import React, { useState, useEffect } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from '@/components/ui/card';
import SelectDropDown from "@/components/Inputs/Select";

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
const RoleManager: React.FC = () => {
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

    const handleDelete = (role: FormValues) => {
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
                    Swal.fire("Deleted!", "The role has been deleted.", "success").then(() => {
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

    const handleEdit = (role: FormValues) => {
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
        <Card className="flex flex-col gap-2">
            <ToastContainer />
            <Dialog open={showModal === "block"} onOpenChange={showModalHandler}>
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
                            <DialogContent className='z-[10000] w-full max-w-7xl'>
                                <DialogHeader>
                                    <DialogTitle>
                                        {isEditing ? "Edit Role" : "Create New Role"}
                                    </DialogTitle>
                                    <DialogDescription />
                                </DialogHeader>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/3">
                                        <Input label="Role Code" type="text" placeholder="Enter role code" name="code" />
                                    </div>
                                    <div className="w-full xl:w-1/3">
                                        <Input label="Role Name" type="text" placeholder="Enter role name" name="role_name" />
                                    </div>
                                    <div className="w-full xl:w-1/3">
                                        <SelectDropDown label="Status" options={[{ value: "Y", text: "Active" }, { value: "N", text: "Inactive" }]} name="active" />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className='rounded-full mx-2'>{selectedRole ? 'Update Role' : 'Create Role'}</Button>
                                    <Button type="button" className='rounded-full mx-2' variant={`destructive`} onClick={showModalHandler}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <CardContent>
                <DataTable columns={columns(handleEdit, handleDelete)} data={sampleType} handleAdd={toggleModal} />
            </CardContent>
        </Card>
    );
};

export default RoleManager;