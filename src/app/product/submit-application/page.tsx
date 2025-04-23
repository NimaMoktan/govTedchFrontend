"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Card, CardContent } from '@/components/ui/card';
import { IoAddCircleSharp } from "react-icons/io5";
import { BsTrash3 } from "react-icons/bs";
import { useLoading } from '@/context/LoadingContext';
import { Formik, Form, FieldArray } from 'formik';
import { Button } from '@/components/ui/button';
import Input from '@/components/Inputs/Input';
import * as Yup from 'yup';
import Select from "@/components/Inputs/Select";
import FileInput from '@/components/Inputs/FileInput';
import { getOrganisations } from '@/services/organisation/OrganisationService';
import { Options } from '@/interface/Options';
import { Organisation } from '@/types/organisation/Organisation';
import api from '@/lib/axios';
import { getSampleType, getSampleTypes } from '@/services/sample/SampleService';
import { SampleType } from '@/types/sample/sample';
import { createProduct } from '@/services/product/ProductService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { ApplicationFormValues } from '@/types/product/Product';


type TestType = {
    id: number;
    code: string;
    description: string;
    test: string;
    created_date: string;
    created_by: string;
    last_updated_date: string;
    last_updated_by: string;
    active: string;
    quantityRequired: string;
    rateNu: number;
};


const SubmitAppPage = () => {
    const [organizationOptions, setOrganizationOptions] = useState<Options[]>([]);
    const [sampleTypeOptions, setSampleTypeOptions] = useState<Options[]>([]);
    const [testTypeOptionsList, setTestTypeOptionsList] = useState<Options[][]>([]);
    const [originalSampleType, setOriginalSampleType] = useState<TestType[]>([])
    const { setIsLoading } = useLoading();
    const router = useRouter();

    const formatFullName = useCallback((firstName: string, lastName: string, middleName?: string): string => {
        const nameParts = [firstName];
        if (middleName?.trim()) nameParts.push(middleName);
        nameParts.push(lastName);
        return nameParts.join(' ').trim();
    }, []);

    const fetchUserByCid = useCallback(async (cid: string, setFieldValue: (field: string, value: any) => void) => {
        if (cid.length > 10) {
            try {
                const response = await api.get(`calibration/api/getCitizenDtls/${cid}`);
                const citizen = response.data.citizenDetailsResponse.citizenDetail[0];
                const fullName = formatFullName(citizen.firstName, citizen.lastName, citizen.middleName);
                setFieldValue('name', fullName);
            } catch (error) {
                console.error('Error fetching user by CID:', error);
            }
        }
    }, [formatFullName]);

    const handleCidChange = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const cid = e.target.value;
        setFieldValue('cid', cid);
        setFieldValue('name', '');
        await fetchUserByCid(cid, setFieldValue);
    }, [fetchUserByCid]);

    const fetchSampleTypeById = async (sampleTypeId: number, index: number, setFieldValue: any) => {
        try {
            const response = await getSampleType(sampleTypeId);
            setOriginalSampleType(response.data.data.productTestTypes)
            const options = response.data.data.productTestTypes.map((type: SampleType) => ({
                value: type.code,
                text: type.description,
            }));

            setTestTypeOptionsList(prev => {
                const updated = [...prev];
                updated[index] = options;
                return updated;
            });

            setFieldValue(`productDetailsEntities[${index}].sampleTypeId`, sampleTypeId.toString());

        } catch (error) {
            console.error("Failed to fetch sample type", error);
        }
    };

    const handleChangeTestType = (value: string, index: number, setFieldValue: any) => {
        const result = originalSampleType.find(item => item.code === value);
        setFieldValue(`productDetailsEntities[${index}].testCode`, value)
        setFieldValue(`productDetailsEntities[${index}].rate`, result?.rateNu)
    }

    const handleChangeQuantity = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        setFieldValue: any,
        values: ApplicationFormValues
    ) => {
        const value = parseFloat(e.target.value);
        const rate = values.productDetailsEntities[index].rate;

        if (!isNaN(value)) {
            setFieldValue(`productDetailsEntities[${index}].quantity`, value);
            setFieldValue(`productDetailsEntities[${index}].totalAmount`, value * rate);
        } else {
            setFieldValue(`productDetailsEntities[${index}].quantity`, 0);
            setFieldValue(`productDetailsEntities[${index}].totalAmount`, 0);
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [orgRes, sampleRes] = await Promise.all([
                    getOrganisations(),
                    getSampleTypes()
                ]);

                setOrganizationOptions(orgRes.data.map((org: Organisation) => ({
                    value: org.id,
                    text: org.description,
                })));

                setSampleTypeOptions(sampleRes.data.map((sample: SampleType) => ({
                    value: sample.id,
                    text: sample.description,
                })));
            } catch (error) {
                console.error("Error loading form data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [setIsLoading]);

    const initialValues: ApplicationFormValues = {
        cid: '',
        name: '',
        address: '',
        contactNumber: '',
        emailAddress: '',
        organizationId: '',
        productDetailsEntities: [{}].map(() => ({
            sampleTypeId: '',
            testCode: '',
            typeOfWork: '',
            sourceOfSample: '',
            quantity: 0,
            rate: 0,
            siteCode: '',
            totalAmount: 0
        }))
    };

    const validationSchema = Yup.object({
        cid: Yup.string().required("CID is required"),
        name: Yup.string().required("Full name is required"),
        address: Yup.string().required("Address is required"),
        contactNumber: Yup.string().required("Contact number is required"),
        emailAddress: Yup.string().email("Invalid email").required("Email is required"),
        organizationId: Yup.string().required("Organization is required"),
        tests: Yup.array().of(
            Yup.object().shape({
                sampleTypeId: Yup.string().required("Sample Type is required"),
                testCode: Yup.string().required("Test Type is required"),
                typeOfWork: Yup.string().required("Type of work is required"),
                sourceOfSample: Yup.string().required("Source of sample is required"),
                quantity: Yup.number().required("Quantity is required"),
                rate: Yup.number(),
                totalAmount: Yup.number(),
            })
        )
    });

    const handleSubmit = async (values: ApplicationFormValues) => {
        setIsLoading(true)
        await createProduct(values).then((response)=>{
            const { data } = response;
            console.log(data)
            toast.success(response.message, { position: "top-right", autoClose: 1000 });
            Swal.fire({
                      title: "Success",
                      text: `These are your application number: `,
                      icon: "success",
                      confirmButtonText: "Ok",
                    }).then(() => router.push("/product/application-list"));
        }).finally(()=>setIsLoading(false))
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Submit Application" parentPage="Products" />
            <Card>
                <CardContent>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ values, setFieldValue, isSubmitting, isValid }) => (
                            <Form>
                                <div className="flex flex-col gap-6 xl:flex-row mt-4">
                                    <div className="w-full xl:w-1/2">
                                        <Input
                                            label="CID Number"
                                            name="cid"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCidChange(e, setFieldValue)}
                                            type="text"
                                            placeholder="Enter Your CID Number"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input label="Full Name" name="name" type="text" disabled placeholder="Full Name" />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input
                                            label="Address"
                                            name="address"
                                            type="text"
                                            placeholder="Enter Your Address"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 xl:flex-row mt-6">
                                    <div className="w-full xl:w-1/2">
                                        <Input name="contactNumber" label="Contact Number" type="text" />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input name="emailAddress" label="Email" type="email" />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Select
                                            label="Client List"
                                            name="organizationId"
                                            options={organizationOptions}
                                            onValueChange={(value: string) => setFieldValue("organizationId", value)}
                                        />
                                    </div>
                                </div>

                                <FieldArray name="productDetailsEntities">
                                    {({ push, remove }) => (
                                        <>
                                            {values.productDetailsEntities.map((product, index) => (
                                                <div key={index} className="border p-4 mt-6 bg-gray-100 rounded">
                                                    <div className="flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full xl:w-1/2">
                                                            <Select
                                                                label="Type of Sample"
                                                                name={`productDetailsEntities[${index}].sampleTypeId`}
                                                                options={sampleTypeOptions}
                                                                onValueChange={(value) => fetchSampleTypeById(Number(value), index, setFieldValue)}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Select
                                                                label="Test Type"
                                                                name={`productDetailsEntities[${index}].testCode`}
                                                                options={testTypeOptionsList[index] || []}
                                                                onValueChange={(value) => handleChangeTestType(value, index, setFieldValue)}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Type of Work"
                                                                name={`productDetailsEntities[${index}].typeOfWork`}
                                                                type="text"
                                                                placeholder="Enter type of work"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-6 xl:flex-row mt-4">
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Source of Sample"
                                                                name={`productDetailsEntities[${index}].sourceOfSample`}
                                                                type="text"
                                                                placeholder="Enter source of sample"
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Quantity"
                                                                name={`productDetailsEntities[${index}].quantity`}
                                                                type="number"
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeQuantity(e, index, setFieldValue, values)}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Rate"
                                                                name={`productDetailsEntities[${index}].rate`}
                                                                type="number"
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Total Amount"
                                                                name={`productDetailsEntities[${index}].totalAmount`}
                                                                type="number"
                                                                readOnly
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size={`sm`}
                                                            variant="destructive"
                                                            className="mt-7 rounded-full"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <BsTrash3 /> Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-end mt-4">
                                                <Button
                                                    className='rounded-full'
                                                    type="button"
                                                    size={`sm`}
                                                    onClick={() => {
                                                        push({
                                                            sampleTypeId: '',
                                                            testTypeId: '',
                                                            model: '',
                                                            serialNumberOrModel: '',
                                                            quantity: 0,
                                                            amount: 0,
                                                            total_quantity: 0
                                                        });
                                                        setTestTypeOptionsList(prev => [...prev, []]);
                                                    }}
                                                >
                                                    <IoAddCircleSharp size={20} className="mr-2" /> Add More
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </FieldArray>

                                {/* <div className="mt-6">
                                    <h3 className="font-medium text-black dark:text-white">Additional Information (Optional)</h3>
                                    <FileInput label="Upload Specific Document" />
                                </div> */}

                                <div className="flex justify-center mt-6">
                                    <Button type="submit" className='rounded-full' size={`lg`} disabled={!isValid || isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </DefaultLayout>
    );
};

export default SubmitAppPage;
