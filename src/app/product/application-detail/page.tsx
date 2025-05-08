"use client"
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Button } from '@/components/ui/button';
import Input from '@/components/Inputs/Input';
import Select from "@/components/Inputs/Select";
import { Formik, Form } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Registration } from '@/types/product/Product';
import { getProductByAppNumber } from '@/services/product/ProductService';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HasRole } from '@/context/PermissionContext';
import * as Yup from 'yup';
import { Options } from '@/interface/Options';
import axios from 'axios';
import Status from '@/components/Status/Status';

const AppDetailsPage: React.FC = () => {
    const [appDetails, setAppDetails] = useState<Registration | null>(null);
    const [defaultAccordionValue, setDefaultAccordionValue] = useState<string>("item-0");
    const [storedRoles, setStoredRoles] = useState("");
    const [technicianOption, setTechnician] = useState<Options[]>([]);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");

    const loadTechnician = async () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/core/public/getAll`)
            .then((response) => {
                const data = response.data.data;
                const options = data.map((item: any) => ({
                    value: item.userId,
                    text: item.fullName,
                }));
                setTechnician(options);
            })
            .catch((error) => {
                console.error("Error fetching technician data:", error);
            }
            );
    }

    useEffect(() => {
        const roles = localStorage.getItem("roles");
        if (roles) {
            const parsedRoles = Array.isArray(roles) ? roles : JSON.parse(roles);
            setStoredRoles(parsedRoles);
        }
        const fetchAppDetails = async () => {
            if (applicationNumber !== null) {
                getProductByAppNumber(applicationNumber).then((res) => {
                    const { data } = res.data;
                    setAppDetails(data || null);
                })
            }
        }
        fetchAppDetails();
        loadTechnician();

    }, [applicationNumber])

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='Product' pageName="Application Details" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Application Number */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Application Number
                            </label>
                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                                {applicationNumber?.toUpperCase()} <Status code={appDetails?.statusId ?? 0} label={appDetails?.status} />
                            </div>
                        </div>

                        {/* CID Number */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                CID Number
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                {appDetails?.cid}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Full Name
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                {appDetails?.name}
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Contact Number
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                {appDetails?.contactNumber}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Email Address
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                {appDetails?.emailAddress}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Organization
                            </label>
                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                {appDetails?.organizationDetails.description}
                            </div>
                        </div>
                    </div>
                </div>
                {appDetails?.productDetailsEntities.map((item, index) => (
                    <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 mt-4">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            value={defaultAccordionValue}
                            onValueChange={(value) => setDefaultAccordionValue(value)}
                        >
                            <AccordionItem
                                value={`item-${index}`}
                                className="border-0"
                            >
                                <AccordionTrigger className="[&[data-state=open]>svg:last-child:rotate-180 [&[data-state=open]]:no-underline hover:no-underline">
                                    <h2>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                                            Sample - {index + 1}
                                        </span>
                                        <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                                            ( {item?.sampleTestType.description} ({item.sampleTestType.code}) -
                                        </span>
                                        <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                                            {item?.productTestType.description} ({item.productTestType.code}) )
                                        </span>

                                    </h2>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Sample Test Type
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.sampleTestType.description} (${item.sampleTestType.code})`}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Test Type
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.productTestType.description} (${item.productTestType.code})`}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Source of Sample
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.sourceOfSample}`}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Type of Work
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {`${item?.typeOfWork}`}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Rate
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.productTestType.rateNu}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Quantity
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.quantity}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Amount (Quantity x Rate)
                                            </label>
                                            <div className="text-base font-medium text-gray-800 dark:text-white">
                                                {item?.amount}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}

                <HasRole hasRoles={storedRoles} roles={["SRP"]}>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 mt-4">
                        <Formik
                            initialValues={{ assignTo: "", remarks: "", applicationId: applicationNumber?.toUpperCase() }}
                            validationSchema={Yup.object({
                                statusId: Yup.string().required("Status is required."),
                                applicationId: Yup.string().required("Application ID is required."),
                                assignTo: Yup.string().required("Technician is required."),
                                remarks: Yup.string().required("Remarks is required"),

                            })}
                            onSubmit={(values) => console.log(values)}
                        >
                            <Form>
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <Select label="Action" name="statusId" options={[{
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
                                        ]} onValueChange={() => console.log("Selection changed!")} />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Select label="Assign To" name="assignTo" options={technicianOption} onValueChange={() => console.log("Selection changed!")} />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input label="Remarks" name="remarks" required />
                                    </div>
                                </div>
                                <Button type="submit" className='rounded-full'>
                                    Submit
                                </Button>
                            </Form>
                        </Formik>
                    </div>
                </HasRole>
            </div>
        </DefaultLayout>
    );
};

export default AppDetailsPage;