"use client";
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { Formik, Form, FormikState, FormikProps } from "formik";
import * as Yup from 'yup';
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getUser, updateUser } from '@/services/UserService';
import { getRoles } from '@/services/RoleService';
import { User } from '@/types/User';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

interface RoleDropdown {
    value: string;
    text: string;
}

const UsersEdit = ({ params }: { params: { id: string } }) => {
    const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([]);
    const [initialValues, setInitialValues] = useState<User>({
        id: 0,
        userName: '',
        cidNumber: '',
        fullName: '',
        email: '',
        mobileNumber: '',
        userRoles: [],
        active: 'Y',
    });
    const { setIsLoading, isLoading } = useLoading();
    const router = useRouter();
    const { id } = params;

    const handleSubmit = async (values: User, { resetForm }: { resetForm: (nextState?: Partial<FormikState<User>>) => void }) => {
        setIsLoading(true);
        try {
            await updateUser(values.id, values).then((response) => {
                toast.success(response.data.message, {
                    duration: 1500,
                    position: 'top-right',
                });
                setTimeout(() => {
                    router.push("/user-management/users");
                }, 2000);
            });
            resetForm();
        } catch (error) {
            console.error("ERROR", error);
            toast.error("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch roles
                const rolesResponse = await getRoles();
                if (Array.isArray(rolesResponse.data)) {
                    const roleOptions = rolesResponse.data.map((role) => ({
                        value: String(role.id),
                        text: role.role_name,
                    }));
                    setRoleDropdown([{ value: '', text: 'Select Role' }, ...roleOptions]);
                }

                if (id) {
                    const userResponse = await getUser(Number(id));
                    const userData = userResponse.data.data;
                    console.log(userData.userRole?.map((role: any) => role.roles.id.toString()));
                    setInitialValues({
                        id: userData.id,
                        userName: userData.userName,
                        cidNumber: userData.cidNumber,
                        fullName: userData.fullName,
                        email: userData.email,
                        mobileNumber: userData.mobileNumber,
                        userRoles: userData.userRole?.map((role: any) => role.roles.id.toString()) || [],
                        active: userData.active || 'Y',
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Failed to load user data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Edit User" />
            <Card className="w-full min-h-screen">
                <CardContent className="max-w-full overflow-x-auto min-h-screen">
                    <div className="flex flex-col gap-2">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={Yup.object({
                                userName: Yup.string()
                                    .required('Username is required')
                                    .min(3, 'Must be at least 3 characters'),
                                cidNumber: Yup.string()
                                    .required('CID is required')
                                    .min(11, 'Must be at least 11 characters'),
                                fullName: Yup.string()
                                    .required('Full name is required')
                                    .min(3, 'Must be at least 3 characters'),
                                email: Yup.string()
                                    .required('Email address is required')
                                    .email('Invalid email address'),
                                userRoles: Yup.array()
                                    .min(1, 'At least one role is required'),
                                mobileNumber: Yup.string()
                                    .required('Mobile Number is required')
                                    .min(8, 'Enter at least 8 characters'),
                            })}
                            onSubmit={handleSubmit}
                            enableReinitialize={true}
                        >
                            {(formik) => (
                                <Form>
                                    <div className="p-4 md:p-5 space-y-4 -mt-2">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input 
                                                    label="CID" 
                                                    type="text" 
                                                    disabled={true} 
                                                    autoComplete="off" 
                                                    placeholder="Enter your CID" 
                                                    name="cidNumber" 
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <Input 
                                                    label="Full Name" 
                                                    autoComplete="off" 
                                                    disabled={true} 
                                                    type="text" 
                                                    placeholder="Enter your full name" 
                                                    name="fullName" 
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input 
                                                    label="Username" 
                                                    type="text" 
                                                    disabled={true} 
                                                    placeholder="Enter userName" 
                                                    name="userName" 
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <Input 
                                                    label="Email" 
                                                    type="email" 
                                                    placeholder="Enter email address" 
                                                    name="email" 
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input 
                                                    label="Phone Number" 
                                                    type="text" 
                                                    placeholder="Enter phone number" 
                                                    name="mobileNumber" 
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <MultiSelect 
                                                    label="Role" 
                                                    name="userRoles" 
                                                    options={roleDropdown} 
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading} className='rounded-full mx-2'>
                                            {isLoading ? 'Updating...' : 'Update'}
                                        </Button>
                                        <Link href="/user-management/users">
                                            <Button type="reset" variant="destructive" className='rounded-full mx-2'>Back</Button>
                                        </Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </CardContent>
            </Card>
        </DefaultLayout>
    );
};

export default UsersEdit;