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
import { getLabSites } from '@/services/lab-site/LabSiteService';
import { LabSite } from '@/types/lab-site/labsite';
import { Product } from '@/types/product/Product';

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
    const [testTypeOptionsList, setTestTypeOptionsList] = useState<{
        value: string;
        text: string;
    }[]>([]);
    const [labSite, setLabSite] = useState<Options[]>([]);
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

    const fetchSampleTypeById = async (sampleTypeId: number, setFieldValue: any) => {
        try {
            const response = await getSampleType(sampleTypeId);
            setOriginalSampleType(response.data.data.productTestTypes)
            setFieldValue(`sampleTypeId`, sampleTypeId.toString());
        } catch (error) {
            console.error("Failed to fetch sample type", error);
        }
    };

    const handleChangeTestType = (value: string, index: number, setFieldValue: any) => {
        const result = originalSampleType.find(item => item.code === value);
        if (result) {
            setFieldValue(`productDetailsEntities[${index}].testCode`, value)
            setFieldValue(`productDetailsEntities[${index}].rate`, result?.rateNu)
        }
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
                const [orgRes, sampleRes, labsiteRes] = await Promise.all([
                    getOrganisations(),
                    getSampleTypes(),
                    getLabSites()
                ]);

                setOrganizationOptions(orgRes.data.map((org: Organisation) => ({
                    value: org.id,
                    text: org.description,
                })));

                setSampleTypeOptions(sampleRes.data.map((sample: SampleType) => ({
                    value: sample.id,
                    text: sample.description,
                    type: sample.test,
                })));

                setLabSite(labsiteRes.data.map((item: LabSite) => ({
                    value: item.code,
                    text: item.description,
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
        amount: 0,
        sampleTypeId: '',
        testCode: '',
        productDetailsEntities: [{
            sampleTypeId: '',
            testCode: '',
            typeOfWork: '',
            sourceOfSample: '',
            quantity: 0,
            rate: 0,
            siteCode: '',
            totalAmount: 0,
            amount: 0,
            sampleTestType: { id: 0, code: '', description: '', active: '' },
            productTestType: {
                id: 0,
                sampleCode: '',
                code: '',
                description: '',
                active: '',
                quantityRequired: '',
                rateNu: 0,
                testSiteCode: ''
            }
        }]
    };

    const validationSchema = Yup.object({
        cid: Yup.string().required("CID is required"),
        name: Yup.string().required("Full name is required"),
        address: Yup.string().required("Address is required"),
        contactNumber: Yup.string().required("Contact number is required"),
        emailAddress: Yup.string().email("Invalid email").required("Email is required"),
        organizationId: Yup.string().required("Organization is required"),
        sampleTypeId: Yup.string().required("Sample Type is required"),
        productDetailsEntities: Yup.array().of(
            Yup.object().shape({
                testCode: Yup.string().required("Test Type is required"),
                typeOfWork: Yup.string().required("Type of work is required"),
                sourceOfSample: Yup.string().required("Source of sample is required"),
                quantity: Yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
                rate: Yup.number().required("Rate is required"),
                totalAmount: Yup.number().required("Total amount is required"),
            })
        ).min(1, "At least one product detail is required")
    });

    const handleSubmit = async (values: ApplicationFormValues, { setSubmitting, setErrors }: any) => {
        try {
            setIsLoading(true);
            
            // Validate the form values before submission
            await validationSchema.validate(values, { abortEarly: false });
            const submissionData = {
                ...values,
                productDetailsEntities: values.productDetailsEntities.map(item => ({
                    ...item,
                    siteCOde: values.testCode, // Add siteCode from the main form
                    sampleTestTypeId: values.sampleTypeId, 
                }))
            };

           await createProduct(submissionData).then((response) => {

               toast.success(response.message, { position: "top-right", autoClose: 1000 });
               const { data } = response;
               
               const ptlCodes = Array.isArray(data) 
                   ? data.map((item: Product) => item.ptlCode).filter((code: string) => code) 
                   : [];
               if (ptlCodes.length > 0) {
                   Swal.fire({
                       title: "Success",
                       html: `Your application numbers are:<br>${ptlCodes.join('<br>')}`,
                       icon: "success",
                       confirmButtonText: "Ok",
                   }).then(() => router.push("/product/application-list"));
               } else {
                   toast.error("No application numbers returned. Please check your submission.", {
                       position: "top-right",
                       autoClose: 5000,
                   });
               }
           });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                // Convert Yup errors to Formik errors format
                const errors = error.inner.reduce((acc: any, curr: any) => {
                    // Handle nested errors for productDetailsEntities
                    if (curr.path.includes('productDetailsEntities')) {
                        const match = curr.path.match(/productDetailsEntities\[(\d+)\]\.(\w+)/);
                        if (match) {
                            const index = match[1];
                            const field = match[2];
                            if (!acc.productDetailsEntities) {
                                acc.productDetailsEntities = [];
                            }
                            if (!acc.productDetailsEntities[index]) {
                                acc.productDetailsEntities[index] = {};
                            }
                            acc.productDetailsEntities[index][field] = curr.message;
                        }
                    } else {
                        acc[curr.path] = curr.message;
                    }
                    return acc;
                }, {});
                
                setErrors(errors);
                
                // Show a general error message
                toast.error("Please fix the form errors before submitting", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                console.error("Submission error:", error);
                toast.error("Failed to submit application. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Submit Application" parentPage="Products" />
            <Card>
                <CardContent>
                    <Formik 
                        initialValues={initialValues} 
                        validationSchema={validationSchema} 
                        onSubmit={handleSubmit}
                        validateOnBlur={true}
                        validateOnChange={false}
                    >
                        {({ 
                            values, 
                            setFieldValue, 
                            isSubmitting, 
                            isValid,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            validateForm
                        }) => {
                            
                            return (
                            <Form>
                                <div className="flex flex-col gap-6 xl:flex-row mt-4">
                                    <div className="w-full xl:w-1/2">
                                        <Input
                                            label="CID Number"
                                            name="cid"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCidChange(e, setFieldValue)}
                                            onBlur={handleBlur}
                                            type="text"
                                            placeholder="Enter Your CID Number"
                                            error={touched.cid && errors.cid}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input 
                                            label="Full Name" 
                                            name="name" 
                                            type="text" 
                                            disabled 
                                            placeholder="Full Name" 
                                            error={touched.name && errors.name}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input
                                            label="Address"
                                            name="address"
                                            type="text"
                                            placeholder="Enter Your Address"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.address && errors.address}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 xl:flex-row mt-6">
                                    <div className="w-full xl:w-1/2">
                                        <Input 
                                            name="contactNumber" 
                                            label="Contact Number" 
                                            type="text" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.contactNumber && errors.contactNumber}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Input 
                                            name="emailAddress" 
                                            label="Email" 
                                            type="email" 
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.emailAddress && errors.emailAddress}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Select
                                            label="Client List"
                                            name="organizationId"
                                            options={organizationOptions}
                                            onValueChange={(value: string) => setFieldValue("organizationId", value)}
                                            // onBlur={handleBlur}
                                            // error={touched.organizationId && errors.organizationId}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 xl:flex-row mt-2">
                                    <div className="w-full xl:w-1/2">
                                        <Select
                                            label="Type of Sample"
                                            name={`sampleTypeId`}
                                            options={sampleTypeOptions}
                                            onValueChange={(value) => fetchSampleTypeById(Number(value), setFieldValue)}
                                            // onBlur={handleBlur}
                                            // error={touched.sampleTypeId && errors.sampleTypeId}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <Select
                                            label="Site Code"
                                            name={`siteCode`}
                                            options={labSite}
                                            onValueChange={(value) => {
                                                const result = originalSampleType
                                                    .filter(item => item.test === value)
                                                    .map(type => ({
                                                        value: type.code,
                                                        text: type.description
                                                    }));
                                                setTestTypeOptionsList(result);
                                                setFieldValue(`productDetailsEntities[0].siteCode`, value);
                                            }}
                                            // onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2"/>
                                </div>

                                <FieldArray name="productDetailsEntities">
                                    {({ push, remove }) => (
                                        <>
                                            {values.productDetailsEntities.map((product, index) => {
                                                const productErrors = errors.productDetailsEntities?.[index] as any;
                                                const productTouched = touched.productDetailsEntities?.[index] as any;
                                                
                                                return (
                                                <div key={index} className="border p-4 mt-6 bg-gray-100 rounded">
                                                    <div className="flex flex-col gap-6 xl:flex-row">
                                                        <div className="w-full xl:w-1/2">
                                                            <Select
                                                                label="Test Type"
                                                                name={`productDetailsEntities[${index}].testCode`}
                                                                options={testTypeOptionsList}
                                                                onValueChange={(value) => handleChangeTestType(value, index, setFieldValue)}
                                                                // onBlur={handleBlur}
                                                                // error={productTouched?.testCode && productErrors?.testCode}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Type of Work"
                                                                name={`productDetailsEntities[${index}].typeOfWork`}
                                                                type="text"
                                                                placeholder="Enter type of work"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={productTouched?.typeOfWork && productErrors?.typeOfWork}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Source of Sample"
                                                                name={`productDetailsEntities[${index}].sourceOfSample`}
                                                                type="text"
                                                                placeholder="Enter source of sample"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={productTouched?.sourceOfSample && productErrors?.sourceOfSample}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-6 xl:flex-row mt-4">
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Quantity"
                                                                name={`productDetailsEntities[${index}].quantity`}
                                                                type="number"
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    handleChange(e);
                                                                    handleChangeQuantity(e, index, setFieldValue, values);
                                                                }}
                                                                onBlur={handleBlur}
                                                                error={productTouched?.quantity && productErrors?.quantity}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Rate"
                                                                name={`productDetailsEntities[${index}].rate`}
                                                                type="number"
                                                                readOnly
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={productTouched?.rate && productErrors?.rate}
                                                            />
                                                        </div>
                                                        <div className="w-full xl:w-1/2">
                                                            <Input
                                                                label="Total Amount"
                                                                name={`productDetailsEntities[${index}].totalAmount`}
                                                                type="number"
                                                                readOnly
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={productTouched?.totalAmount && productErrors?.totalAmount}
                                                            />
                                                        </div>
                                                        {index > 0 && (
                                                            <Button
                                                                type="button"
                                                                size={`sm`}
                                                                variant="destructive"
                                                                className="mt-7 rounded-full"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <BsTrash3 /> Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )})}

                                            <div className="flex justify-end mt-4">
                                                <Button
                                                    className='rounded-full'
                                                    type="button"
                                                    size={`sm`}
                                                    onClick={() => push({
                                                        sampleTypeId: '',
                                                        testCode: '',
                                                        typeOfWork: '',
                                                        sourceOfSample: '',
                                                        quantity: 0,
                                                        rate: 0,
                                                        siteCode: values.productDetailsEntities[0]?.siteCode || '',
                                                        totalAmount: 0,
                                                        amount: 0,
                                                        sampleTestType: { id: 0, name: '', code: '', description: '', active: '' },
                                                        productTestType: {
                                                            id: 0,
                                                            sampleCode: '',
                                                            code: '',
                                                            description: '',
                                                            created_date: '',
                                                            created_by: '',
                                                            last_updated_date: '',
                                                            last_updated_by: '',
                                                            active: '',
                                                            quantityRequired: '',
                                                            rateNu: 0,
                                                            ratesInNu: 0,
                                                            testSiteCode: ''
                                                        }
                                                    })}
                                                >
                                                    <IoAddCircleSharp size={20} className="mr-2" /> Add More
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </FieldArray>

                                <div className="flex justify-center mt-6">
                                    <Button 
                                        type="submit" 
                                        className='rounded-full' 
                                        size={`lg`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Application"}
                                    </Button>
                                </div>
                            </Form>
                        )}}
                    </Formik>
                </CardContent>
            </Card>
        </DefaultLayout>
    );
};

export default SubmitAppPage;