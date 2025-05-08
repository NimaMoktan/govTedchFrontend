"use client"
import React, { useEffect, useState } from "react";
import Input from "@/components/Inputs/Input";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import logo from "/public/images/logo/logo.png";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label";
import axios from "axios";

const OTP_EXPIRATION_TIME = 180; // 3 minutes in seconds
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/core/public`;
interface ForgotPasswordFormValues {
    email: string;
}

interface VerifyOtpFormValues {
    oneTimePassword: string;
    email: string;
}

interface ResetPasswordFormValues {
    newPassword: string;
    confirmPassword: string;
    email: string;
}

// Component to sync OTP state with Formik
const OtpFormSync = ({ oneTimePassword }: { oneTimePassword: string; setOneTimePassword: React.Dispatch<React.SetStateAction<string>> }) => {
    const { setFieldValue } = useFormikContext();
    
    useEffect(() => {
        setFieldValue("oneTimePassword", oneTimePassword);
    }, [oneTimePassword, setFieldValue]);

    return null;
};

const ForgotPassword = () => {
    const [mailSent, setMailSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpExpiryTime, setOtpExpiryTime] = useState(OTP_EXPIRATION_TIME);
    const [oneTimePassword, setOneTimePassword] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();

    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const handleOtpChange = (value: string) => {
        setOneTimePassword(value);
    };

    const handleForgotPassword = async (values: ForgotPasswordFormValues, { setSubmitting }: any) => {
        try {
            const response = await api.post("/forgot", {
                email: values.email
            });

            if (response.data) {
                toast.success("OTP sent successfully");
                setUserEmail(values.email);
                setMailSent(true);
                setOtpExpiryTime(OTP_EXPIRATION_TIME);
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Failed to send OTP"
            );
            console.error("Forgot password error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyOtp = async (values: VerifyOtpFormValues, { setSubmitting }: any) => {
        try {
            const response = await api.post("/verify", {
                email: userEmail,
                oneTimePassword: values.oneTimePassword
            });

            if (response.data) {
                toast.success("OTP verified successfully");
                setOtpVerified(true);
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "OTP verification failed"
            );
            console.error("OTP verification error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (values: ResetPasswordFormValues, { setSubmitting }: any) => {
        try {
            if (values.newPassword !== values.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }

            const response = await api.post("/reset", {
                email: userEmail,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            });

            if (response.data) {
                toast.success("Password reset successfully");
                router.push("/signin"); // Redirect to login page after successful reset
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Password reset failed"
            );
            console.error("Reset password error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (mailSent && otpExpiryTime > 0 && !otpVerified) {
            interval = setInterval(() => {
                setOtpExpiryTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [mailSent, otpExpiryTime, otpVerified]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResendOtp = async () => {
        try {
            const response = await api.post("/forgot", {
                email: userEmail
            });

            if (response.data) {
                toast.success("New OTP has been sent to your email");
                setOtpExpiryTime(OTP_EXPIRATION_TIME);
                setOneTimePassword("");
                setOtpVerified(false);
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Failed to resend OTP"
            );
            console.error("Resend OTP error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <ToastContainer />
                <div className="flex flex-wrap items-center">
                    <div className="flex flex-col justify-center rounded-lg p-6 space-y-4">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={logo}
                                alt="BSB Logo"
                                width={150}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                        <div className="form-group text-center">
                            <span className="font-bold text-gray-400">
                                Password Reset
                            </span>
                        </div>
                        
                        {!mailSent ? (
                            // Step 1: Email form
                            <Formik
                                initialValues={{
                                    email: ''
                                }}
                                validationSchema={Yup.object({
                                    email: Yup.string()
                                        .email("Invalid email address")
                                        .required("Email is required")
                                })}
                                onSubmit={handleForgotPassword}
                            >
                                {({ isSubmitting, values, setFieldValue }) => (
                                    <Form className="w-full space-y-4">
                                        <div>
                                            <Input
                                                type="email"
                                                name="email"
                                                label="Email"
                                                placeholder="Enter email address"
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
                                                    Submitting...
                                                </span>
                                            ) : "Send OTP"}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        ) : !otpVerified ? (
                            // Step 2: OTP verification
                            <Formik
                                initialValues={{
                                    oneTimePassword: '',
                                    email: userEmail
                                }}
                                validationSchema={Yup.object({
                                    oneTimePassword: Yup.string()
                                        .length(6, "OTP must be 6 characters")
                                        .required("OTP is required")
                                })}
                                onSubmit={handleVerifyOtp}
                            >
                                {({ isSubmitting, values }) => (
                                    <Form className="w-full space-y-4">
                                        <OtpFormSync oneTimePassword={oneTimePassword} setOneTimePassword={setOneTimePassword} />
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-500 mb-4">
                                                Enter the OTP sent to {userEmail}
                                            </Label>
                                            <InputOTP 
                                                maxLength={6} 
                                                className="w-full mt-4"
                                                value={oneTimePassword}
                                                onChange={handleOtpChange}
                                                disabled={otpExpiryTime === 0}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {otpExpiryTime === 0 && (
                                                <p className="text-red-500 text-xs mt-2">
                                                    OTP has expired. Please request a new one.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span>
                                                OTP expires in: {formatTime(otpExpiryTime)}
                                            </span>
                                            <Button 
                                                type="button" 
                                                variant="link"
                                                onClick={handleResendOtp}
                                                disabled={otpExpiryTime > 0}
                                                className={otpExpiryTime > 0 ? "text-gray-400" : "text-primary"}
                                            >
                                                Resend OTP
                                            </Button>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting || otpExpiryTime === 0}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Validating...
                                                </span>
                                            ) : "Validate"}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        ) : (
                            // Step 3: Reset password form
                            <Formik
                                initialValues={{
                                    newPassword: '',
                                    confirmPassword: '',
                                    email: userEmail
                                }}
                                validationSchema={Yup.object({
                                    newPassword: Yup.string()
                                        .min(8, "Password must be at least 8 characters")
                                        .required("Password is required"),
                                    confirmPassword: Yup.string()
                                        .oneOf([Yup.ref('newPassword')], "Passwords must match")
                                        .required("Please confirm your password")
                                })}
                                onSubmit={handleResetPassword}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-4">
                                        <div>
                                            <Input
                                                type="password"
                                                name="newPassword"
                                                label="New Password"
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                type="password"
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
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
                                            ) : "Reset Password"}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        )}

                        <Button
                            type="button"
                            className="w-full"
                            variant={"outline"}
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;