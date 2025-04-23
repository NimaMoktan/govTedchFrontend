"use client"
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Button } from '@/components/ui/button';
import Input from '@/components/Inputs/Input';
import Select from "@/components/Inputs/Select";
import { Formik, Form } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApplicationFormValues } from '@/types/product/Product';
import { getProduct } from '@/services/product/ProductService';

const AppDetailsPage: React.FC = () => {
    // const [sampleTypeOptions, setSampleTypeOptions] = useState<Options[]>([]);
    const [appDetails, setAppDetails] = useState<ApplicationFormValues | null>(null);

    const searchParams = useSearchParams();
    const applicationNumber = searchParams.get("applicationNumber");
    const id = searchParams.get("id");

    useEffect(()=>{
        const fetchAppDetails = async () => {
            getProduct(Number(id)).then((res)=>{
                const { data } = res.data;
                setAppDetails(data || null);
            })
        }
        fetchAppDetails();
    },[id])

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='Product' pageName="Application Details" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Application Number */}
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Application Number
                            </label>
                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                                {applicationNumber?.toUpperCase()}
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
                    </div>
                </div>
                {appDetails?.productDetailsEntities.map((item, index)=>(<>
                <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 mt-4">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Test Sample Details
                        </h2>
                    </div>

                    {/* Collapsible Content */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out`}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Equipment/Instrument */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Test Code
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {item?.testCode}
                                </div>
                            </div>

                            {/* Manufacturer/Type/Brand */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Site Code
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                {item?.siteCode}
                                </div>
                            </div>

                            {/* Range */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Range
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {/* {equipment?.[0]?.range || "—"} */}
                                </div>
                            </div>

                            {/* Serial Number/Model */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Serial Number/Model
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {/* {appDetails?.deviceRegistry?.[0]?.serialNumberOrModel || "—"} */}
                                </div>
                            </div>

                            {/* Rate */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Rate
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {/* {appDetails?.deviceRegistry?.[0]?.rate || "—"} */}
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Amount
                                </label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {/* {appDetails?.deviceRegistry?.[0]?.amount || "—"} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>))}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 mt-4">
                    <Formik
                        initialValues={{ status: "", remarks: "", applicationNumber: "" }}
                        onSubmit={(values) => console.log(values)}
                    >
                        <Form>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <Select label="Select Status" name="status" options={[{ value: "approve", text: "Approve" }, { value: "reject", text: "Reject" }]} onValueChange={() => console.log("Selection changed!")} />
                                </div>
                                <div className="w-full xl:w-1/2">

                                    {/* <input name="applicationNumber" type="hidden" value={applicationNumber ?? ''}/> */}
                                    <Input label="Remarks" name="remarks" required />
                                </div>
                            </div>
                            <Button type="submit" className='rounded-full'>
                                Submit
                            </Button>
                        </Form>
                    </Formik>
                </div>

            </div>
        </DefaultLayout>
    );
};

export default AppDetailsPage;