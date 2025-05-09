import React from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/Inputs/Input';
import Select from "@/components/Inputs/Select";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Registration } from '@/types/product/Product';
import { updateWorkFlow, uploadRawData } from '@/services/product/ProductService';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const TechniciantForm = ({ applicationNumber, appDetails }: { 
    applicationNumber: string; 
    appDetails: Registration 
}) => {
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        if (!file) {
            toast.error("Please upload an Excel file");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // First update the workflow
            const claimApp = {
                id: values.id,
                applicationNumber: values.applicationNumber,
                serviceId: values.serviceId,
                statusId: values.status,
                remarks: values.remarks,
                taskStatusId: values.taskStatus,
                siteCode: values.siteCode,
                parameter: "defaultParameterValue"
            };

            const workflowResponse = await updateWorkFlow(claimApp);
            
            if (workflowResponse.statusCode === 200) {
                const formData = new FormData();
                formData.append('File', file);
                formData.append('applicationNumber', values.applicationNumber);
                
                const uploadResponse = await uploadRawData(formData);
                
                if (uploadResponse.statusCode === 200) {
                    toast.success(uploadResponse.message);
                    setTimeout(() => {
                        router.push(`/product/application-list`);
                    }, 1500);
                } else {
                    toast.error("Workflow updated but file upload failed");
                }
            } else {
                toast.error("Failed to update application workflow");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while processing your request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files.length > 0) {
            const selectedFile = event.currentTarget.files[0];
            const allowedTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                toast.error('Please upload only Excel files (.xls, .xlsx)');
                event.currentTarget.value = '';
                setFile(null);
            }
        } else {
            setFile(null);
        }
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
                    taskStatus: appDetails?.taskStatusId,
                    siteCode: appDetails?.siteCode,
                    file: null
                }}
                validationSchema={Yup.object({
                    status: Yup.string().required("Action is required."),
                    remarks: Yup.string().required("Remarks is required"),
                    file: Yup.mixed()
                        .required("Excel file is required")
                        .test('fileType', 'Only Excel files are accepted', (value) => {
                            if (!value) return false;
                            const file = value as File;
                            return [
                                'application/vnd.ms-excel',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            ].includes(file.type);
                        })
                })}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isValid, errors, touched }) => (
                    <Form>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <Select 
                                    label="Action" 
                                    name="status" 
                                    options={[
                                        { value: "3002", text: "Approved" },
                                        { value: "3000", text: "Reject" }
                                    ]} 
                                    onValueChange={(value) => {
                                        setSelectedStatus(value);
                                        setFieldValue('status', value);
                                    }} 
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <input 
                                    type="file" 
                                    id="file"
                                    name="file"
                                    required
                                    accept=".xls,.xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={(event) => {
                                        handleFileChange(event);
                                        setFieldValue('file', event.currentTarget.files?.[0] || null);
                                    }}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="file"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Test Result Excel (Required)
                                </label>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('file')?.click()}
                                    >
                                        Choose File
                                    </Button>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {file ? file.name : 'No file chosen'}
                                    </span>
                                </div>
                                {errors.file && touched.file && (
                                    <div className="text-red-500 text-sm mt-1">{errors.file}</div>
                                )}
                            </div>
                            
                            <div className="w-full xl:w-1/2">
                                <Input label="Remarks" name="remarks" />
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            className='rounded-full'
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default TechniciantForm;