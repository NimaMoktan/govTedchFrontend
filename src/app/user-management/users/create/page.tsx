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
import { createUser } from '@/services/UserService';
import { getRoles } from '@/services/RoleService';
import { User } from '@/types/User';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import api from '@/lib/axios';
import { useLoading } from '@/context/LoadingContext';

interface RoleDropdown {
    value: string;
    text: string;
}

const UsersCreate = () => {
    const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([])
    const { setIsLoading, isLoading } = useLoading()

    const router = useRouter();

    const handleSubmit = async (
        values: User,
        resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void
    ) => {
        setIsLoading(true)
        try {
            await createUser(values).then((response) => {
                toast.success(response.data.message, {
                    duration: 1500,
                    position: 'top-right',
                })
                setTimeout(() => {
                    // setIsLoading(false)
                    router.push("/user-management/users");
                }, 2000);
            }).catch((e)=>{
                toast.error("Error while creating user.")
            }).finally(()=>setIsLoading(false))

            resetForm();
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    const formatFullName = (
        firstName: string,
        lastName: string,
        middleName?: string | null
    ): string => {
        const nameParts = [firstName];

        if (middleName?.trim()) {
            nameParts.push(middleName);
        }

        nameParts.push(lastName);

        return nameParts.join(' ').trim();
    };

    const fetchUserByCid = debounce(async (cid: string, formik: any) => {
        if (cid.length > 10) {
            try {
                api.get(`calibration/api/getCitizenDtls/${cid}`).then((response) => {
                    const fullName = formatFullName(response.data.citizenDetailsResponse.citizenDetail[0].firstName, response.data.citizenDetailsResponse.citizenDetail[0].middleName, response.data.citizenDetailsResponse.citizenDetail[0].lastName);
                    formik.setFieldValue('fullName', fullName);
                })

            } catch (error) {
                console.error('Error fetching user by CID:', error);
            }
        }
    }, 500); // 500ms debounce delay


    const handleCidChange = (e: React.ChangeEvent<HTMLInputElement>, formik: any) => {
        const cid = e.target.value;
        formik.setFieldValue('cidNumber', cid);
        if (formik.values.fullName) {
            formik.setFieldValue('fullName', '');
        }
        fetchUserByCid(cid, formik);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                await getRoles().then((response) => {

                    if (Array.isArray(response.data)) {
                        const roleOptions = response.data.map((role) => ({
                            value: String(role.id),
                            text: role.role_name,
                        }));
                        setRoleDropdown([{ value: '', text: 'Select Role' }, ...roleOptions]);
                    } else {
                        console.error('Roles data is not an array:', response.data);
                    }
                    // setIsLoading(false);
                });

            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Create User" />
            <Card className="w-full min-h-screen">
                <CardContent className="max-w-full overflow-x-auto min-h-screen">
                    <div className="flex flex-col gap-2">
                        <Formik
                            initialValues={{
                                id: null, // Add default id value
                                userName: '',
                                cidNumber: '',
                                fullName: '',
                                email: '',
                                mobileNumber: '',
                                userRoles: [],  // Prepopulate userRoles
                                active: 'Y',
                            }}
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
                                    .min(1, 'At least one userRole is required'),
                                mobileNumber: Yup.string()
                                    .required('Mobile Number is required')
                                    .min(8, 'Enter at least 8 characters'),
                            })}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values, resetForm);
                            }}
                        >
                            {(formik) => (

                                <Form>
                                    <div className="p-4 md:p-5 space-y-4 -mt-2">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input label="CID" type="text" autoComplete="off" placeholder="Enter your CID" name="cidNumber" onChange={(e: any) => handleCidChange(e, formik)} />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <Input label="Full Name" autoComplete="off" disabled={true} type="text" placeholder="Enter your full name" name="fullName" />
                                            </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input label="Username" type="text" placeholder="Enter userName" name="userName" />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <Input label="Email" type="email" placeholder="Enter email address" name="email" />
                                            </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input label="Phone Number" type="text" placeholder="Enter phone number" name="mobileNumber" />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <MultiSelect label="Role" name="userRoles" options={roleDropdown} />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading} className='rounded-full mx-2'>{isLoading ? 'Submitting...' : 'Submit'}</Button>
                                        <Link href="/user-management/users">
                                            <Button type="reset" variant={`destructive`} className='rounded-full mx-2'>Back</Button>
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

export default UsersCreate;