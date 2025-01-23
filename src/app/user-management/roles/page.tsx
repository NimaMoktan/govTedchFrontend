"use client";
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { BiUserPlus } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Formik, Form, FormikState } from "formik";
import * as Yup from 'yup';
import Input from '@/components/Inputs/Input';
import Switcher from '@/components/Inputs/Switcher';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const RolesPage: React.FC = () => {
    const [showModal, setShowModal] = useState('hidden');
    const [roles, setRoles] = useState<{ code: string; role_name: string; privileges: { name: string; }[] }[]>([]);
    const [token] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [privileges, setPrivileges] = useState([]);

    useEffect(() => {
        const fetchPrivileges = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/privileges/`);
                if (res.ok) {
                const data = await res.json();
                setPrivileges(data.data || []);
                } else {
                console.error("Failed to fetch privileges.");
                }
            } catch (error) {
                console.error("Error fetching privileges:", error);
            }
            };
        
            fetchPrivileges();
        }, []);

    const showModalHandler = () => {
        showModal === 'hidden' ? setShowModal('block') : setShowModal('hidden');
    }

    const handleSubmit = (values: { code: string; role_name: string; active: string; },
        resetForm: { (nextState?: Partial<FormikState<{ code: string; role_name: string; active: string; }>> | undefined): void; (): void; }) => {
            let data = JSON.stringify({
                "code": values.code,
                "role_name": values.role_name,
                "active": "Y"
            });

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2NDg4MjUsImV4cCI6MTczNzY4NDgyNX0.1K_Fcr3XbdAyA-mBQI14wXmPC3C8zfAch8uSbXTB45c",
                    "Content-Type": "application/json",
                },
                body: data,
            }).then((res) => {
                if (res.ok) {
                    toast.success("Role created successfully.", {
                        position: "top-right",
                        autoClose: 2000,
                    })
                    showModalHandler();
                    handleLoadRoles();
                }
            }).finally(() => setIsLoading(false));

            resetForm();
    }

    const handleDelete = (index: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCloseButton: true,
            showConfirmButton: true,
            width: 450
        }).then((result) => {
            const newList = [...roles];
            newList.splice(index, 1);
            setRoles(newList);
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        });
    }

    const handleLoadRoles = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJEZWVwYWsiLCJpYXQiOjE3Mzc2NDg4MjUsImV4cCI6MTczNzY4NDgyNX0.1K_Fcr3XbdAyA-mBQI14wXmPC3C8zfAch8uSbXTB45c",
                },
            });
    
            if (!res.ok) {
                console.error("Failed to fetch roles. Status:", res.status);
                toast.error("Failed to fetch roles.");
                return;
            }
    
            const response = await res.json();
            if (response?.data && Array.isArray(response.data)) {
                const mappedRoles = response.data.map((role: any) => ({
                    code: role.code,
                    role_name: role.role_name,
                    privileges: role.privileges || [], // Privileges directly from the response
                }));
                setRoles(mappedRoles);
            } else {
                console.error("Invalid data format:", response);
                toast.error("Invalid response data.");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("An error occurred while fetching roles.");
        } finally {
            setIsLoading(false);
        }
    };      
    useEffect(() => {
        if (token) {
            handleLoadRoles();
        }
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Roles" />
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="flex max-w-full justify-between items-center mb-5 ">
                        <h1 className="dark:text-white">Roles</h1>
                        <button
                            onClick={showModalHandler}
                            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-4"
                        >
                            <span>
                                <BiUserPlus className="text-white" size={20} />
                            </span>
                            Add Role
                        </button>
                    </div>
                    <div aria-hidden="false" className={`${showModal} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100`}
                        >
                        <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
                            <Formik
                            initialValues={{
                                code: "",
                                role_name: "",
                                active: "",
                                privileges: [],
                            }}
                            validationSchema={Yup.object({
                                code: Yup.string().required("Role code is required"),
                                role_name: Yup.string().required("Role name is required"),
                                privileges: Yup.array().min(1, "Select at least one privilege").required("Privileges are required"),
                            })}
                            onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                            >
                            {({ values, setFieldValue }) => (
                                <Form>
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Create New Role
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={showModalHandler}
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="default-modal"
                                    >
                                        <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    </div>
                                    <div className="p-4 md:p-5 space-y-4">
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <Input
                                            label={"Role Code"}
                                            type={"text"}
                                            placeholder="Enter your role code"
                                            name="code"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <Input
                                            label={"Role Name"}
                                            type={"text"}
                                            placeholder="Enter your role name"
                                            name="role_name"
                                            />
                                        </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2 mt-10">
                                            <Switcher name="active" label="Active" checked={true} />
                                        </div>
                                        </div>

                                        {/* Privilege Field */}
                                        <div className="mb-4.5 flex flex-col gap-6">
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                            Privileges
                                            </label>
                                            <select
                                            name="privileges"
                                            multiple
                                            value={values.privileges}
                                            onChange={(e) =>
                                                setFieldValue(
                                                "privileges",
                                                Array.from(e.target.selectedOptions, (option) =>
                                                    option.value
                                                )
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                            >
                                            {privileges.map((privilege) => (
                                                <option key={privilege.id} value={privilege.id}>
                                                {privilege.name}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button
                                        type="submit"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showModalHandler}
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    >
                                        Close
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
                                <tr className="bg-gray-2 dark:bg-meta-4 text-center">
                                    <th className="px-2 py-2 font-medium text-black dark:text-white xl:pl-11">
                                        SL
                                    </th>
                                    <th className="px-2 py-2 font-medium text-black dark:text-white">
                                        Code
                                    </th>
                                    <th className="px-2 py-2 font-medium text-black dark:text-white xl:pl-11">
                                        Role Name
                                    </th>
                                    <th className="px-2 py-2 font-medium text-black dark:text-white">
                                        Privilege
                                    </th>
                                    <th className="px-2 py-2 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {roles.map((role, key) => (
                                <tr key={key} className='text-center'>
                                    <td className="border-b border-[#eee] dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {key + 1}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] dark:border-strokedark xl:pl-11">
                                        <p className="font-medium text-black dark:text-white">
                                            {role.code}
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] dark:border-strokedark xl:pl-11">
                                        <p className="font-medium text-black dark:text-white">
                                            {role.role_name}
                                        </p>
                                    </td>

                                    {/* Privileges Column */}
                                    <td className="border-b border-[#eee] dark:border-strokedark">
                                        <div className="text-black dark:text-white">
                                            {role.privileges.length > 0 ? (
                                                role.privileges.map((privilege, index) => (
                                                    <span key={index} className="inline-block bg-primary text-white text-xs font-medium rounded-full px-3 py-1 mr-2">
                                                        {privilege.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">No Privileges</span>
                                            )}
                                        </div>
                                    </td>


                                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button className="hover:text-primary">
                                                <BsPencil className="fill-current" size={20} />
                                            </button>
                                            <button className="hover:text-primary" onClick={() => handleDelete(key)}>
                                                <BsTrash className="fill-current" size={18} />
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
}

export default RolesPage;
