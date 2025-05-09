import React from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/Inputs/Input';
import Select from "@/components/Inputs/Select";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Options } from '@/interface/Options';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Registration } from '@/types/product/Product';
import { updateWorkFlow } from '@/services/product/ProductService';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const SampleReceptionistForm = ({applicationNumber, appDetails}: { applicationNumber: string; appDetails: Registration }) => {
    const router = useRouter();
    const [technicianOption, setTechnician] = useState<Options[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const loadTechnician = async () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/core/public/getAll`)
            .then((response) => {
                const data = response.data.data;
                const options = data.map((item: any) => ({
                    value: item.userName,
                    text: item.fullName,
                }));
                setTechnician(options);
            })
            .catch((error) => {
                console.error("Error fetching technician data:", error);
            });
    }

    // Example usage:
// const paymentResponse: PaymentResponse = {
//     refNo: "NML/WM/05-2025/0974",
//     taxPayerNo: "DTH3733",
//     responseDate: "24-01-2025",
//     paymentAdviceNo: "PA250508558581",
//     faultcode: "200",
//     message: "success",
//     paymentMethod: null,
//     paymentMode: null,
//     instrumentNo: "123456789",
//     instrumentDate: "24-01-2025",
//     issuingBank: "BOBL",
//     payableBank: "BOBL",
//     transactionID: "",
//     paymentOrderNo: "",
//     journalNo: "",
//     receiptList: [
//       {
//         receiptNo: "RC243324",
//         receiptDate: "24-01-2025",
//         totalReceiptAmount: "20",
//         paymentAdviceAmount: "1000",
//         paymentAdviceAmountPaid: "1000",
//         balanceAmount: "0",
//         penaltyAmount: "0",
//         penalityDescription: "Application Fee",
//         paymentAdviceStatus: "Paid"
//       }
//     ]
//   };

    const handleSubmit = async (values: any) => {
        await updateWorkFlow(values)
            .then((response) => {
                if (response.statusCode === 200) {
                    console.log(appDetails?.productDetailsEntities[0].siteCode, "site code", appDetails);
                    // if site code is on site hit to payment endpoint
                    if (appDetails?.productDetailsEntities[0].siteCode === "ILT") {
                        const totalPayableAmount = appDetails?.productDetailsEntities.reduce((sum, item) => sum + (item.amount || 0), 0);

                        api.post(`${process.env.NEXT_PUBLIC_API_URL}/product/workflow/payment`, {
                            code: "moit",
                            platform: "TMS",
                            refNo: appDetails?.applicationNumber,
                            taxPayerNo: appDetails?.cid,
                            taxPayerDocumentNo: null,
                            paymentRequestDate: new Date().toISOString(),
                            agencyCode: "MPG5932",
                            payerEmail: appDetails?.emailAddress,
                            mobileNo: appDetails?.contactNumber,
                            totalPayableAmount: totalPayableAmount,
                            paymentDueDate: null,
                            taxPayerName: appDetails?.name,
                            paymentLists: [
                                {
                                serviceCode: "100",
                                description: "Fines and Penalties",
                                payableAmount: totalPayableAmount
                                }
                            ]
                        })
                        .then((response) => {
                            console.log("Payment response:", response.data);
                        })
                        .catch((error) => {
                            console.error("Error submitting payment:", error);
                        });
                    }   
                    toast.success(response.message);
                    setTimeout(() => {
                        router.push(`/product/application-list`);
                    }, 1500);
                } else {
                    toast.error("Failed to update application.");
                }
            })
            .catch((error) => {
                console.error("Error updating application:", error);
                toast.error("An error occurred while updating the application.");
            })
    }

    useEffect(() => {
        loadTechnician();
    }, []);

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 mt-4">
            <Formik
                initialValues={{
                    id: appDetails?.id,
                    serviceId: appDetails?.serviceId,
                    applicationNumber: applicationNumber?.toUpperCase(),
                    status: "",
                    remarks: "",
                    assignedUser: "",
                    taskStatus: appDetails?.taskStatusId,
                    siteCode: appDetails?.siteCode
                }}
                validationSchema={Yup.object({
                    status: Yup.string().required("Action is required."),
                    assignedUser: selectedStatus === "1005" ? 
                        Yup.string().required("Technician is required.") : 
                        Yup.string(),
                    remarks: Yup.string().required("Remarks is required"),
                })}
                onSubmit={(values) => handleSubmit(values)}
            >
                <Form>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <Select 
                                label="Action" 
                                name="status" 
                                options={[
                                    {
                                        value: "1002",
                                        text: "Verify"
                                    },
                                    {
                                        value: "1005",
                                        text: "Assign"
                                    },
                                    {
                                        value: "1011",
                                        text: "Reject"
                                    }
                                ]} 
                                onValueChange={handleStatusChange} 
                            />
                        </div>
                        
                        {selectedStatus === "1005" && (
                            <div className="w-full xl:w-1/2">
                                <Select 
                                    label="Assign To" 
                                    name="assignedUser" 
                                    options={technicianOption} 
                                />
                            </div>
                        )}
                        
                        <div className="w-full xl:w-1/2">
                            <Input label="Remarks" name="remarks" />
                        </div>
                    </div>
                    <Button type="submit" className='rounded-full'>
                        Submit
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default SampleReceptionistForm;