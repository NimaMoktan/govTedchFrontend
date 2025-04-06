"use client";
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useState, useEffect } from 'react';
import { Formik, Form, FormikState } from "formik";
import * as Yup from 'yup';
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import { Privilege } from '@/types/Privilege';
import { createPrivilege } from '@/services/PrivilegesService';

const PrivilegeCreate = () => {
    const { setIsLoading, isLoading } = useLoading()

    const router = useRouter();

    const handleSubmit = async (
        values: Privilege,
        resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void
    ) => {
        setIsLoading(true)
        try {
            await createPrivilege(values).then((response) => {
                toast.success(response.data.message, {
                    duration: 1500,
                    position: 'top-right',
                })
                setTimeout(() => {
                    // setIsLoading(false)
                    router.push("/user-management/privileges");
                }, 2000);
            })
            resetForm();
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Create Privilege" />
            <Card className="w-full">
                <CardContent className="max-w-full overflow-x-auto">
                    <div className="flex flex-col gap-2">
                        <Formik
                            initialValues={{
                                name: '',
                                active: 'Y',
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .required('Privilege name is required'),
                            })}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values, resetForm);
                            }}
                        >
                            {() => (

                                <Form>
                                    <div className="p-4 md:p-5 space-y-4 -mt-2">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input label="Privilege Name" type="text" placeholder="Enter Privilege Name" name="name" />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                {/* <Input label="Email" type="email" placeholder="Enter email address" name="email" /> */}
                                            </div>
                                        </div>
                                        
                                        <Button type="submit" disabled={isLoading} className='rounded-full mx-2'>{isLoading ? 'Submitting...' : 'Submit'}</Button>
                                        <Link href="/user-management/privileges">
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

export default PrivilegeCreate;