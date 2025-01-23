"use client"
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { BiUserPlus } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import Input from '@/components/Inputs/Input';
import Switcher from '@/components/Inputs/Switcher';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Permission {
    id: number;
    code: string;
    role_name: string;
    privileges: number[];
}

const PermissionsPage: React.FC = () => {
    const [showModal, setShowModal] = useState('hidden');
    const [permissions, setPermissions] = useState<any[]>([]);  
    const [token] = useState(localStorage.getItem('token'));
    const [privilegesData, setPrivilegesData] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Permission | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const rolesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/roles/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const privilegesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/privileges/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const rolesData = rolesResponse.data.data;
                const privilegesData = privilegesResponse.data.data;

                setPrivilegesData(privilegesData);

                const rolesWithMappedPrivileges = rolesData.map((role: any) => {
                    const mappedPrivileges = role.privileges.map((privilege: any) => {
                        const matchedPrivilege = privilegesData.find((p: any) => p.id === privilege.id);
                        return matchedPrivilege ? matchedPrivilege.name : null;
                    });

                    return { ...role, privileges: mappedPrivileges.filter((name: any) => name) };
                });

                setPermissions(rolesWithMappedPrivileges);
            } catch (error) {
                console.error("Error fetching data:", error);
                setPermissions([]);
            }
        };

        fetchPermissions();
    }, [token]);

    const showModalHandler = (product: Permission | null = null) => {
        setSelectedProduct(product);
        setShowModal(showModal === 'hidden' ? 'block' : 'hidden');
    };

    const handleSubmit = async (values: { code: string; role_name: string; status: boolean; privileges: any[] }, resetForm: { (): void; }) => {
        const formattedData = {
            code: values.code,
            role_name: values.role_name,
            active: values.status ? "Y" : "N",
            privileges: values.privileges.map((id: number) => ({ id }))
        };

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/roles/createRoleWithPrivileges`, formattedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Role successfully created!",
            }).then(() => {
                window.location.reload(); // Refresh after success
            });
            setPermissions([...permissions, { ...formattedData, privileges: values.privileges }]);
            resetForm();
            showModalHandler();
        } catch (error) {
            console.error("Error creating role:", error);
            Swal.fire('Error', 'There was an error creating the role', 'error');
            resetForm();
            showModalHandler();
        }
    };
    const handleUpdatePrivileges = async (roleId: number, privileges: any[]) => {
        const requestData = {
            role_id: roleId,
            privileges: privileges.map((id: number) => ({ id }))
        };
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/roles/addPrivilegesToRole`, requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Privileges updated successfully!",
            }).then(() => {
                window.location.reload(); // Refresh after success
            });
        } catch (error) {
            console.error("Error updating privileges:", error);
            Swal.fire('Error', 'There was an error updating the privileges', 'error');
        }
    };
    
    const handleDelete = (index: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCloseButton: true,
            showConfirmButton: true,
            width: 450
        }).then((result) => {
            const newList = [...permissions];
            newList.splice(index, 1);
            setPermissions(newList);
            if (result.isConfirmed) {
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        });
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Permissions" />
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="flex max-w-full justify-between items-center mb-5">
                        <h1 className="dark:text-white">Permissions</h1>
                        <button onClick={() => showModalHandler(null)} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-4">
                            <span><BiUserPlus className="text-white" size={20} /></span>
                            Add Permission
                        </button>
                    </div>

                    <div aria-hidden="false" className={`${showModal} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}>
                        <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
                        <Formik
                            initialValues={{
                                code: selectedProduct ? selectedProduct.code : '',
                                role_name: selectedProduct ? selectedProduct.role_name : '',
                                privileges: selectedProduct ? selectedProduct.privileges : [],
                            }}
                            validationSchema={Yup.object({
                                code: Yup.string().required("Code is required"),
                                role_name: Yup.string().required("Role name is required"),
                                privileges: Yup.array().min(1, "At least one privilege must be selected"),
                            })}
                            enableReinitialize={true}
                            onSubmit={(values, { resetForm }) => {
                                if (selectedProduct?.id) {
                                    // Only call handleUpdatePrivileges if selectedProduct.id is defined
                                    handleUpdatePrivileges(selectedProduct.id, values.privileges);
                                    resetForm();
                                    showModalHandler(); // Close the modal after submission
                                } else {
                                    console.error("selectedProduct.id is undefined");
                                }
                            }}
                        >

                            {({ values, setFieldValue }) => (
                                <Form>
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {selectedProduct ? 'Edit Role' : 'Create New Role'}
                                            </h3>
                                            <button type="button" onClick={() => showModalHandler()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="p-4 md:p-5 space-y-4">
                                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                <div className="w-full xl:w-1/2">
                                                    <Input label={"Role Code"} type={"text"} placeholder="Enter your role code" name="code" />
                                                </div>

                                                <div className="w-full xl:w-1/2">
                                                    <Input label={"Role Name"} type={"text"} placeholder="Enter your role name" name="role_name" />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Privileges</label>
                                                <div className="mt-2 space-y-2">
                                                {privilegesData.map((privilege) => {
                                                    const isChecked = selectedProduct?.privileges.some(
                                                        (p) => p === privilege.id
                                                    );

                                                    return (
                                                        <div key={privilege.id} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                name="privileges"
                                                                value={privilege.id}
                                                                checked={values.privileges.includes(privilege.id) || isChecked}
                                                                onChange={() => {
                                                                    const newPrivileges = values.privileges.includes(privilege.id)
                                                                        ? values.privileges.filter((id: number) => id !== privilege.id)
                                                                        : [...values.privileges, privilege.id];
                                                                    setFieldValue("privileges", newPrivileges);
                                                                }}
                                                                className="form-checkbox"
                                                            />
                                                            <span className="ml-2">{privilege.name}</span>
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                Save
                                            </button>
                                            <button type="button" onClick={() => showModalHandler()} className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm px-5 py-2.5">
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-default dark:bg-boxdark">
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 font-medium text-sm text-gray-600 dark:text-gray-400">Role Code</th>
                                <th className="px-6 py-4 font-medium text-sm text-gray-600 dark:text-gray-400">Role Name</th>
                                <th className="px-6 py-4 font-medium text-sm text-gray-600 dark:text-gray-400">Privileges</th>
                                <th className="px-6 py-4 font-medium text-sm text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((role, index) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4">{role.code}</td>
                                    <td className="px-6 py-4">{role.role_name}</td>
                                    <td className="px-6 py-4">{role.privileges.join(', ')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button onClick={() => showModalHandler(role)} className="text-blue-600 hover:text-blue-900">
                                                <BsPencil size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(index)} className="text-red-600 hover:text-red-900">
                                                <BsTrash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PermissionsPage;
