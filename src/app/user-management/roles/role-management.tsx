"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { toast } from "sonner"
import { DataTable } from "./table";
import { columns } from "./columns";
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
import { deleteRole, getRoles } from "@/services/RoleService";
import { getPrivileges } from "@/services/PrivilegesService";
import { Role } from "@/types/Role";
import { Privilege } from "@/types/Privilege";

const RoleManager: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
    const [isEditing, setIsEditing] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [privileges, setPrivileges] = useState<Privilege[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
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
            const rs = await getPrivileges();
            setPrivileges(rs.data);
        } catch (error) {
            toast.error("An error occurred while fetching privileges.");
        }
    };

    const loadRoles = async() => {
        const rs = await getRoles();
        console.log("Roles", rs.data);
        setRoles(rs.data);
        
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsEditing(true);
        setShowModal("block");
    };

    const handleSubmit = async (values: Role, resetForm: () => void) => {
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
                // [response, privilegesResponse] = await Promise.all([
                //     fetch(url, {
                //         method,
                //         headers: {
                //             Authorization: `Bearer ${token}`,
                //             "Content-Type": "application/json",
                //         },
                //         body: JSON.stringify(updatePayload),
                //     }),
                    // fetch(url, {
                    //     method,
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify(updatePayload),
                    // }),
                // ]);

                // Process responses
                // const responseData = await response.json();
                // const privilegesResponseData = await privilegesResponse.json();

                // console.log("Response Data:", responseData);
                // console.log("Privileges Response Data:", privilegesResponseData);

                // if (privilegesResponseData.statusCode !== 200) {
                //     throw new Error(privilegesResponseData.message);
                // }
            } else {

                // response = await fetch(url, {
                //     method,
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    //     "Content-Type": "application/json",
                    // },
                //     body: Payload,
                // });
            }
            // toast.success(isEditing ? "Role Updated!" : "Role Created!",{
            //     delay: 1000,
            //     description: 
            //     confirmButtonText: "Great, Thanks!",
            //     confirmButtonColor: "#4caf50", // Green color for success
            //     allowOutsideClick: false, // Prevent closing when clicking outside
            //     isEditing
            //         ? "The role has been updated successfully."
            //         : "The role has been created successfully.",
            // }).then(() => {
            //     router.push("/user-management/roles");
            // });
            resetForm();
            showModalHandler();
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.", {
                position: "top-right",
            });
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    const handleDelete = (role: Role) => {
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
                if (role?.id !== undefined) {
                    await deleteRole(role.id);
                } else {
                    toast.error("Role ID is undefined. Cannot delete the role.");
                }
                Swal.fire("Deleted!", "The role has been deleted.", "success").then(() => {
                    router.push("/user-management/roles");
                });
            }
        });
    };

    useEffect(() => {
        loadRoles();
        handleLoadPrivileges();
    }, [isEditing]);

    return (
        <Card className="flex flex-col gap-2">
            <ToastContainer />
            <Dialog open={showModal === "block"} onOpenChange={showModalHandler}>
                <Formik<Role>
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
                                        <SelectDropDown onValueChange={()=>{}} label="Status" options={[{ value: "Y", text: "Active" }, { value: "N", text: "Inactive" }]} name="active" />
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
                <DataTable columns={columns(handleEdit, handleDelete)} data={roles} handleAdd={toggleModal} />
            </CardContent>
        </Card>
    );
};

export default RoleManager;