"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Card, CardContent } from '@/components/ui/card';
import { IoAddCircleSharp } from "react-icons/io5";
import { BsTrash3 } from "react-icons/bs";
import { useLoading } from '@/context/LoadingContext';
import { Formik, Form } from 'formik';
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

interface EquipmentItem {
  equipment?: string;
  manufacturer?: string;
  model?: string;
  amount?: number;
  total_quantity?: number;
}

interface FormValues {
  cid: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  organizationId: string;
  equipment: string[];
  manufacturer: string[];
  model: string[];
  amount: number[];
  total_quantity: number[];
}

const SubmitAppPage = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([{}]);
  const [organizationOptions, setOrganizationOptions] = useState<Options[]>([]);
  const [sampleTypeOptions, setSampleTypeOptions] = useState<Options[]>([]);
  const { setIsLoading } = useLoading();

  const formatFullName = useCallback((
    firstName: string,
    lastName: string,
    middleName?: string | null
  ): string => {
    const nameParts = [firstName];
    if (middleName?.trim()) {
      nameParts.push(middleName);
    }
    nameParts.push(lastName);
    return nameParts.join(' ').trim();
  }, []);

  const fetchUserByCid = useCallback(async (cid: string, setFieldValue: (field: string, value: any) => void) => {
    if (cid.length > 10) {
      try {
        const response = await api.get(`calibration/api/getCitizenDtls/${cid}`);
        const citizen = response.data.citizenDetailsResponse.citizenDetail[0];
        const fullName = formatFullName(citizen.firstName, citizen.lastName, citizen.middleName);
        setFieldValue('fullName', fullName);
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
    setFieldValue('cidNumber', cid);
    setFieldValue('fullName', '');
    await fetchUserByCid(cid, setFieldValue);
  }, [fetchUserByCid]);

  const addEquipment = useCallback(() => {
    setEquipmentList(prevList => [...prevList, {}]);
  }, []);

  const removeEquipment = useCallback((index: number) => {
    setEquipmentList(prevList => prevList.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    const getSampleTypeList = async () => {
        setIsLoading(true);
      try {
        const response = await getSampleTypes();
        setSampleTypeOptions(
          Array.isArray(response.data) 
            ? response.data.map((org: SampleType) => ({
                value: org.id,
                text: org.description,
              }))
            : []
        );
      } finally {
        setIsLoading(false);
      }
    }

    const fetchOrganization = async () => {
      setIsLoading(true);
      try {
        const response = await getOrganisations();
        setOrganizationOptions(
          Array.isArray(response.data) 
            ? response.data.map((org: Organisation) => ({
                value: org.id,
                text: org.description,
              }))
            : []
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
    getSampleTypeList();
  }, [setIsLoading]);

  const initialValues: FormValues = {
    cid: '',
    fullName: '',
    address: '',
    contactNumber: '',
    email: '',
    organizationId: '',
    equipment: [],
    manufacturer: [],
    model: [],
    amount: [],
    total_quantity: [],
  };

  const validationSchema = Yup.object({
    cid: Yup.string().required("CID is required"),
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    contactNumber: Yup.string().required("Contact number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    organizationId: Yup.string().required("Organization is required"),
    equipment: Yup.array().of(Yup.string().required("Equipment is required")),
    manufacturer: Yup.array().of(Yup.string().required("Manufacturer is required")),
    model: Yup.array().of(Yup.string().required("Model is required")),
    amount: Yup.array().of(Yup.number().required("Amount is required")),
    total_quantity: Yup.array().of(Yup.number().required("Total quantity is required")),
  });

  const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
    // Handle form submission
    console.log(values);
    // resetForm();
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Submit Application" parentPage='Products' />
      <div className="flex flex-col gap-2">
        <Card className="w-full">
          <CardContent className="max-w-full overflow-x-auto">
            <div className="flex flex-col gap-2">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, values, isValid, isSubmitting, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-4.5 mt-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                      
                        <Input
                          label="CID Number"
                          name="cidNumber"
                          type="text"
                          placeholder="Enter Your CID Number"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            handleCidChange(e, setFieldValue)
                          }
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Full Name"
                          disabled
                          name="fullName"
                          type="text"
                          placeholder="Enter Your Full Name"
                        />
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

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Contact Number"
                          name="contactNumber"
                          type="text"
                          placeholder="Enter Your Contact Number"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Select
                          label="Client List"
                          name="organizationId"
                          options={organizationOptions}
                          onValueChange={(value: string) => setFieldValue('organizationId', value)}
                        />
                      </div>
                    </div>

                    {equipmentList.map((_, index) => (
                      <div key={index} className="w-full rounded border-[1.5px] border-stroke bg-gray-100 px-5 py-3 mt-5 text-black outline-none focus:border-primary dark:border-form-strokedark">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <Select
                              label="Type of Sample"
                              name={`sample[${index}]`}
                              options={sampleTypeOptions}
                              onValueChange={(value: string) => setFieldValue(`sample[${index}]`, value)}
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <Input
                              label="Manufacturer/Type/Brand"
                              name={`manufacturer[${index}]`}
                              type="text"
                              placeholder="Enter Manufacturer/Type/Brand"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <Input
                              label="Range"
                              name={`model[${index}]`}
                              type="text"
                              placeholder="Enter The Range"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <Input
                              label="Model/Serial Number"
                              name={`serialNumberOrModel[${index}]`}
                              type="text"
                              placeholder="Enter The Model/Serial Number"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <Input
                              label="Quantity Of Equipment"
                              name={`quantity[${index}]`}
                              type="number"
                              placeholder="Enter The Quantity Of Equipment"
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <Input
                              name={`amount[${index}]`}
                              type="number"
                              placeholder="Enter The Rate/Amount"
                              label="Rate/Amount"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <Input
                              name={`total_quantity[${index}]`}
                              type="number"
                              placeholder="Enter The Total Amount"
                              label="Total Amount"
                              readOnly
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <Button 
                              type="button" 
                              size="lg" 
                              variant="destructive" 
                              className="right-10 gap-2 px-4 py-2 mt-7 rounded-full"
                              onClick={() => removeEquipment(index)}
                            >
                              <BsTrash3 />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex w-full justify-end">
                      <Button
                        variant="outline"
                        size="lg"
                        type="button"
                        className="mt-2 px-4 py-2 rounded-full"
                        onClick={addEquipment}
                      >
                        <IoAddCircleSharp size={33} />
                        Add More
                      </Button>
                    </div>

                    <div className="mb-6 mt-5">
                      <h3 className="font-medium text-black dark:text-white">
                        Additional Information (Optional)
                      </h3>
                      <FileInput label="Upload Specific Document" />
                    </div>
                    <div className="flex w-full items-center justify-center">
                      <Button
                        size="lg"
                        type="submit"
                        className="w-ful mt-2 ml-5 px-4 py-2 rounded-full"
                        disabled={!isValid || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
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