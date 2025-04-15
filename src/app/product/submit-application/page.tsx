"use client";
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product/Product';
import { createProduct } from '@/services/product/ProductService';
import { useLoading } from '@/context/LoadingContext';
import { Formik, Form } from 'formik';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/Inputs/MultiSelect';
import Input from '@/components/Inputs/Input';
import * as Yup from 'yup'
import Link from 'next/link';

const SubmitAppPage = () => {
    const [product, setProduct] = useState<Product[]>([]);
    const { setIsLoading } =useLoading();

    const handleSubmit = () => {

    }

    useEffect(()=>{

        // const fetchProducts = async() => {
        //     setIsLoading(true)
        //     const list = await getProducts().finally(()=>setIsLoading(false));
        //     setProductList(list.data)
        // }

        // fetchProducts()

    },[setIsLoading])

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Submit Application" parentPage='Products' />
            <div className="flex flex-col gap-2">
                <Card className="w-full">
                    <CardContent className="max-w-full overflow-x-auto">
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
                                // handleSubmit(values, resetForm);
                            }}
                        >
                            {(formik) => (

                                <Form>
                                    <div className="p-4 md:p-5 space-y-4 -mt-2">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input label="CID" type="text" autoComplete="off" placeholder="Enter your CID" name="cidNumber"/>
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
                                                <MultiSelect label="Role" name="userRoles" options={[]} />
                                            </div>
                                        </div>
                                        <Button type="submit"  className='rounded-full mx-2'>Submit</Button>
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
            </div>
        </DefaultLayout>

    );
};

export default SubmitAppPage;