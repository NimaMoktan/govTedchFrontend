"use client"
import React, { useEffect, useState } from "react";
import Input from "@/components/Inputs/Input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import logo from "/public/images/logo/logo.png";


const ForgotPassword = () => {
    const router = useRouter()

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
        
    };
    
    useEffect(() => {
    
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card >
                <ToastContainer />
                <div className="flex flex-wrap items-center">
                    <div className="flex flex-col justify-center rounded-lg p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                            <Image 
                                src={logo} // Update this path to your logo
                                alt="BSB Logo"
                                width={150} // Adjust as needed
                                height={100} // Adjust as needed
                                className="object-contain"
                            />
                        </div>
                        <div className="form-group text-center">
                            <span className="font-bold text-gray-400">
                                Password Reset
                            </span>
                        </div>

                        <Formik
                            initialValues={{
                                email: ''
                            }}
                            validationSchema={Yup.object({
                                email: Yup.string()
                                    .required("Email field is required.")
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="w-full space-y-4">
                                    <div>
                                        <Input
                                            type="text"
                                            name="email"
                                            label="Email ID"
                                            placeholder="Enter Email ID"
                                            autoComplete="off"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Resetting...
                                            </span>
                                        ) : "Reset"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;