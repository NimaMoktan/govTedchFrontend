/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from "next/navigation";
import axios from "axios";
// import { toast } from "react-toastify";
import Input from '@/components/Inputs/Input';
import Select from '@/components/Inputs/Select';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Swal from 'sweetalert2';
import * as Yup from 'yup';

interface ApplicationDetails {
    id: string;
    cid: string;
    clientName: string;
    contactNumber: string;
    emailAddress: string;
    deviceRegistry: { testItemId: string; manufacturerOrTypeOrBrand: string; rate?: string; amount?: string; serialNumberOrModel?: string, quantity?: string; id?: number; siteCode?: string;}[];
}

const DetailForm: React.FC = () => {
    const [token, setToken] = useState<string | null>();
    const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
    const [equipment, setEquipment] = useState<{
        range: string; description: string
    }[]>([]);
    const [isChief, setIsChief] = useState<boolean | null>();
    const [isLabHead, setIsLabHead] = useState<boolean | null>();

    const searchParams = useSearchParams();

    const router = useRouter();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");

    const [isDeviceDetailsOpen, setIsDeviceDetailsOpen] = useState(false); 
    const toggleDeviceDetails = () => {
        setIsDeviceDetailsOpen(prev => !prev);
    };  
    const validationSchema = Yup.object({
        status: Yup.string()
            .required('Select a status (Approve or Reject)')
            .oneOf(['approve', 'reject'], 'Invalid status selected'),
        calibration_officer: Yup.string().when('status', {
            is: 'approve',
            then: (schema) =>
            schema
                .required('Please select a Calibration Officer')
                .oneOf(
                ['Dorji Wangchuk', 'Pema Dorji'],
                'Invalid Calibration Officer selected'
                ),
            otherwise: (schema) => schema.notRequired(),
        }),
        });
    const fetchEquipment = async (id: any) => {

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationItems/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("This is the data equipment: ", data);
            const filteredEquipment = data.data.filter((item: any) => item.id === id);
            setEquipment(filteredEquipment);


            if (!data || !Array.isArray(data.data)) {
                throw new Error("Invalid response format: Expected 'data' to be an array.");
            }

        } catch (error) {
            console.error("Error fetching equipment data:", error);
        }
    };

    const calculateTotalPayableAmount = () => {
        if (!applicationDetails?.deviceRegistry) return 0;
    
        return applicationDetails.deviceRegistry.reduce((total: number, device: any) => {
            const rate = parseFloat(device.rate || 0); // Use `rate` if available
            const quantity = parseFloat(device.quantity || 1); // Default to 1 if `quantity` is missing
            return total + rate * quantity;
        }, 0);
    };

    const handleSubmitForLabHead = async (values: any) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        // Extract siteCode from applicationDetails.deviceRegistry[0]
        const siteCode = applicationDetails?.deviceRegistry[0]?.siteCode;
        console.log("This the siteCode: ", siteCode);
    
        try {
            // ==== NEW PAYLOAD FOR BOTH REQUESTS ====
            const payloadForStandardEquipment = {
                equipmentName: values.remarks,
                traceability: values.traceability,
                equipmentMake: values.make,
                balanceSensitivity: values.balanceSensitivity,
                equipmentValidity: values.equipmentValidity,
                calibrationProcedure: values.calibrationProcedure,
                environmentCondition: values.environmentCondition,
                relativeHumidity: values.relativeHumidity,
                equipmentDetails: values.equipmentDetails,
                equipmentCertificateNo: values.equipmentCertificateNo,
            };
    
            const totalPayableAmount = calculateTotalPayableAmount();
    
            // ==== FIRST REQUEST TO EXISTING ENDPOINT ====
            if (siteCode === "ON") {
                console.log("Reaching for onsite (existing logic): ", siteCode);
                const data = {
                    id: applicationDetails?.id,
                    applicationNumber: values.applicationNumber,
                    userId: parsedUser?.id,
                    userName: parsedUser?.userName,
                    status: values.status,
                    calibration_officer: values.calibration_officer,
                };
    
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/${id}/updateWorkflow`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            userId: parsedUser?.id,
                            userName: parsedUser?.userName,
                        },
                    }
                );
    
                console.log("SiteCode=ON - updateWorkflow Response:", response);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Success!",
                        text: "Application status updated successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push("/applications-list");
                        }
                    });
                }
    
            } else if (siteCode === "ILT") {
                console.log("Reaching for insite (existing logic): ", siteCode);
    
                const timestamp = Date.now().toString();
                const formattedDate = new Date(Number(timestamp)).toISOString().split('T')[0];
    
                const data = {
                    code: "moit",
                    platform: "TMS",
                    refNo: values.applicationNumber,
                    taxPayerNo: applicationDetails?.cid || "—",
                    taxPayerDocumentNo: "123456789",
                    paymentRequestDate: formattedDate,
                    agencyCode: "MPG5932",
                    payerEmail: parsedUser?.email || "",
                    mobileNo: parsedUser?.mobileNumber || "",
                    totalPayableAmount: totalPayableAmount.toString(),
                    paymentDueDate: null,
                    id: applicationDetails?.id || "",
                    taxPayerName: parsedUser?.userName || "",
                    paymentLists: [
                        {
                            serviceCode: "100",
                            description: "Fines and Penalties",
                            payableAmount: totalPayableAmount.toString(),
                        },
                    ],
                };
    
                const response = await fetch(`${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/payment`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": parsedUser?.id || "",
                        "userName": parsedUser?.userName || "",
                    },
                    body: JSON.stringify(data),
                });
    
                console.log("SiteCode=ILT - /workflow/payment Request Sent with Data: ", JSON.stringify(data));
                const responseData = await response.json();
                console.log("SiteCode=ILT - /workflow/payment Response Received: ", responseData);
    
                if (response.status === 200) {
                    console.log("Successfully sent to /workflow/payment");
    
                    // ==== SECOND REQUEST TO NEW ENDPOINT ====
                    console.log("Now sending to /standardEquipment/create...");
    
                    const standardEquipmentResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/calibration/standardEquipment/create?application_number=${applicationNumber}`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                                "userId": parsedUser?.id || "",
                                "userName": parsedUser?.userName || "",
                            },
                            body: JSON.stringify(payloadForStandardEquipment),
                        }
                    );
                    console.log("This is the data being sent: ", payloadForStandardEquipment);
                    const standardEquipmentData = await standardEquipmentResponse.json();
                    console.log("New Endpoint /standardEquipment/create Response: ", standardEquipmentData);
    
                    if (standardEquipmentResponse.status === 200 || standardEquipmentResponse.status === 201) {
                        console.log("Successfully saved to standard equipment.");
                        Swal.fire({
                            title: 'Success!',
                            text: 'Application and equipment details updated successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/applications-list");
                            }
                        });
                    } else {
                        console.error("Failed to save to standard equipment.");
                        throw new Error("Failed to save equipment data");
                    }
    
                } else {
                    console.error("Failed to update workflow payment.");
                    Swal.fire({
                        title: 'Error!',
                        text: `Failed to update application status. Server response: ${responseData.message || 'Unknown error'}`,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
    
            } else {
                console.warn("Unknown siteCode provided:", siteCode);
                Swal.fire({
                    title: 'Error!',
                    text: `Unknown siteCode: ${siteCode}. Please contact support.`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("Error submitting Lab Head data:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleSubmitForChief = async (values: any) => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
        const data = {
            id: applicationDetails?.id,
            applicationNumber: values.applicationNumber,
            userId: parsedUser?.id,
            userName: parsedUser?.userName,
            status: values.status,
            calibration_officer: values.calibration_officer, // Include calibration officer if applicable
        };
    
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_CAL_API_URL}/workflow/${id}/updateWorkflow`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        userId: parsedUser?.id,
                        userName: parsedUser?.userName,
                    },
                }
            );
    
            if (response.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Application status updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/applications-list");
                    }
                });
            } else {
                throw new Error(`API request failed: ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            throw error; // Re-throw the error for Formik to handle
        }
    };

    const fetchApplicationDetails = useCallback(async () => {
        const storedUser = localStorage.getItem("userDetails");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/calibration/calibrationForm/fetchByApplicationNo?applicationNumber=${applicationNumber}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "userId": parsedUser?.id || "999",
                        "userName": parsedUser?.userName,
                    }
                }
            );
            
            const data = response.data.body.data;
            console.log("This is the details: ", data);
            setApplicationDetails(data);
            fetchEquipment(data.deviceRegistry[0].testItemId);
    
        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    }, [applicationNumber, token]); // ✅ Dependencies included
    
    useEffect(() => {
        const storedUser = localStorage.getItem("userDetails");
        const  storeToken = localStorage.getItem("token")
        setToken(storeToken)
        if (storedUser) {
            const { userRole } = JSON.parse(storedUser);
            const roleList = [userRole[0].roles];
            const chfDir = ["CHF", "DIR"]; // adding all the lab head role codes
            const hasCHF = roleList.some((role: { code: string }) => chfDir.includes(role.code));
            const requiredRoles = ["MLD", "VLD", "TLD", "FLD", "LLD", "PLD"]; // adding all the lab head role codes
            const hasDIT = roleList.some((role: { code: string }) => requiredRoles.includes(role.code));
            setIsChief(hasCHF);
            setIsLabHead(hasDIT);
        }
        fetchApplicationDetails();
    
    }, [applicationNumber, fetchApplicationDetails]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Application Number */}
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Application Number
                </label>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {applicationNumber?.toUpperCase() || "—"}
                </div>
                </div>

                {/* CID Number */}
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    CID Number
                </label>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                    {applicationDetails?.cid || "—"}
                </div>
                </div>

                {/* Full Name */}
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Full Name
                </label>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                    {applicationDetails?.clientName || "—"}
                </div>
                </div>

                {/* Contact Number */}
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Contact Number
                </label>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                    {applicationDetails?.contactNumber || "—"}
                </div>
                </div>

                {/* Email Address */}
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email Address
                </label>
                <div className="text-base font-medium text-gray-800 dark:text-white">
                    {applicationDetails?.emailAddress || "—"}
                </div>
                </div>
            </div>
            </div>
            <br></br>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Device Details
                    </h2>
                    <Button
                    onClick={toggleDeviceDetails}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition"
                    variant="ghost"
                    >
                    {isDeviceDetailsOpen ? (
                        <>
                        Hide <ChevronUp size={18} />
                        </>
                    ) : (
                        <>
                        Show <ChevronDown size={18} />
                        </>
                    )}
                    </Button>
                </div>

                {/* Collapsible Content */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isDeviceDetailsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Equipment/Instrument */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Equipment/Instrument
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {equipment?.[0]?.description || "—"}
                        </div>
                    </div>

                    {/* Manufacturer/Type/Brand */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Manufacturer/Type/Brand
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {applicationDetails?.deviceRegistry?.[0]?.manufacturerOrTypeOrBrand || "—"}
                        </div>
                    </div>

                    {/* Range */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Range
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {equipment?.[0]?.range || "—"}
                        </div>
                    </div>

                    {/* Serial Number/Model */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Serial Number/Model
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {applicationDetails?.deviceRegistry?.[0]?.serialNumberOrModel || "—"}
                        </div>
                    </div>

                    {/* Rate */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Rate
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {applicationDetails?.deviceRegistry?.[0]?.rate || "—"}
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Amount
                        </label>
                        <div className="text-base font-medium text-gray-800 dark:text-white">
                        {applicationDetails?.deviceRegistry?.[0]?.amount || "—"}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <br></br>
            {isChief && (
                <Formik
                    initialValues={{ status: "", remarks: "", applicationNumber: applicationNumber }}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setSubmitting(true); // Start submission process
                            await handleSubmitForChief(values);
                        } catch (error) {
                            console.error("Error submitting data:", error);
                            Swal.fire({
                                title: 'Error!',
                                text: 'Something went wrong. Please try again later.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        } finally {
                            setSubmitting(false); // End submission process
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <Select
                                        label="Select Status"
                                        name="status"
                                        options={[
                                            { value: "approve", text: "Approve" },
                                            { value: "reject", text: "Reject" },
                                        ]}
                                        onValueChange={() => console.log("Selection changed!")}
                                    />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <input name="applicationNumber" type="hidden" value={applicationNumber ?? ''} />
                                    <Input label="Remarks" name="remarks" required />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 justify-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Update"}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
            {isLabHead && (
                <Formik
                    initialValues={{
                        status: "",
                        remarks: "",
                        applicationNumber: applicationNumber,
                        calibration_officer: "",
                    }}
                    validationSchema={validationSchema} 
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setSubmitting(true); // Start submission process
                            await handleSubmitForLabHead(values);
                        } catch (error) {
                            console.error("Error submitting data:", error);
                            Swal.fire({
                                title: 'Error!',
                                text: 'Something went wrong. Please try again later.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        } finally {
                            setSubmitting(false); // End submission process
                        }
                    }}
                >
                    {({ values, isSubmitting, errors, touched }) => (
                        <Form>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <Input label="Equipment Name" name="remarks" required />
                            </div>
                            <div className="w-full xl:w-1/2">
                                <Input label="Traceability" name="traceability" required />
                            </div>
                            <div className="w-full xl:w-1/2">
                                <Input label="Make" name="make" required />
                            </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <Input label="Balance Sensitivity" name="balanceSensitivity" required />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <Input label="Equipment Validity" type="date" name="equipmentValidity" required />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <Input label="Calibration Procedure" type="text" name="calibrationProcedure" required />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <Input label="Environment Condition" name="environmentCondition" required />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <Input label="Relative Humidity" type="text" name="relativeHumidity" required />
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <Input label="Equipment Certificate Number" type="text" name="equipmentCertificateNo" required />
                                </div>
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-full">
                                    <Input label="Equipment Details" type="text" name="equipmentDetails" required />
                                </div>
                            </div>
                            <br/>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                <Select
                                    label="Select Status"
                                    name="status"
                                    options={[
                                        { value: "approve", text: "Approve" },
                                        { value: "reject", text: "Reject" },
                                    ]}
                                    onValueChange={() => console.log("Selection changed!")}
                                    />
                                    {/* Show error message */}
                                    {touched.status && errors.status && (
                                    <div className="text-red-500 text-sm mt-1">{errors.status}</div>
                                    )}
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <input
                                        name="applicationNumber"
                                        type="hidden"
                                        value={applicationNumber ?? ""}
                                    />
                                    <Input label="Remarks" name="remarks" required />
                                </div>

                                {/* Only show Calibration Officer if status is "approve" */}
                                {values.status === "approve" && (
                                <div className="w-full xl:w-1/2">
                                    <Select
                                    label="Select Calibration Officer"
                                    name="calibration_officer"
                                    options={[
                                        { value: "Dorji Wangchuk", text: "Dorji Wangchuk" },
                                        { value: "Pema Dorji", text: "Pema Dorji" },
                                    ]}
                                    onValueChange={() => console.log("Selection changed!")}
                                    />
                                    {/* Show error message */}
                                    {touched.calibration_officer && errors.calibration_officer && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.calibration_officer}
                                    </div>
                                    )}
                                </div>
                                )}
                            </div>

                            {/* Update Button with Dynamic Text */}
                            <button
                                type="submit"
                                className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 justify-center"
                                disabled={isSubmitting} // Disable the button during submission
                            >
                                {isSubmitting ? "Updating..." : "Update"}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default DetailForm;