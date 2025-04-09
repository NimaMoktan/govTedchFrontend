"use client";
import React, { useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from 'yup';
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import { Privilege } from '@/types/Privilege';
import { getPrivileges } from '@/services/PrivilegesService';
import { Role } from '@/types/Role';
import { getRole, updateRole } from '@/services/RoleService';
import CheckBox from '@/components/Inputs/CheckBox';

const EditRole = ({ params }: { params: { id: string } }) => {
    const { setIsLoading, isLoading } = useLoading();
    const [allPrivileges, setAllPrivileges] = React.useState<Privilege[]>([]);
    const [selectedPrivilegeIds, setSelectedPrivilegeIds] = React.useState<number[]>([]);
    const [initialValues, setInitialValues] = React.useState<Partial<Role>>({
        role_name: '',
        code: '',
        privileges: [],
        active: 'Y',
    });
    
    const router = useRouter();
    const { id } = params;

    const handleSubmit = async (values: Partial<Role>, { resetForm }: FormikHelpers<Partial<Role>>) => {
        setIsLoading(true);
        try {
            const roleData = {
                ...values,
                role_name: values.role_name || '', // Ensure role_name is always a string
                privileges: selectedPrivilegeIds.map(id => ({ id })),
                code: values.code || '', // Ensure code is always a string
                active: values.active || 'Y', // Ensure active is always a string
            };
            
            await updateRole(Number(id), roleData).then((response) => {
                toast.success(response.data.message || 'Role updated successfully', {
                    duration: 1500,
                });
                setTimeout(() => {
                    router.push("/user-management/roles");
                }, 2000);
            });
            resetForm();
        } catch (error) {
            console.error("ERROR", error);
            toast.error((error as any)?.response?.data?.message || "Failed to update role", {
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const privilegeId = parseInt(value);

        setSelectedPrivilegeIds(prev =>
            checked
                ? [...prev, privilegeId]
                : prev.filter(id => id !== privilegeId)
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch role data
                const roleResponse = await getRole(Number(id));
                const roleData = roleResponse.data;
                
                // Fetch all privileges
                const privilegesResponse = await getPrivileges();
                setAllPrivileges(privilegesResponse.data);
                
                // Set initial form values
                setInitialValues({
                    role_name: roleData.role_name,
                    code: roleData.code,
                    privileges: roleData.privileges,
                    active: roleData.active || 'Y',
                });
                
                // Set selected privilege IDs
                if (roleData.privileges) {
                    setSelectedPrivilegeIds(roleData.privileges.map((p: Privilege) => p.id));
                }
            } catch (error) {
                toast.error("An error occurred while fetching data.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Edit Role" />
            <Card className="w-full">
                <CardContent className="max-w-full overflow-x-auto">
                    <div className="flex flex-col gap-2">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={Yup.object({
                                role_name: Yup.string().required('Role name is required'),
                                code: Yup.string().required('Role code is required'),
                                // privileges: Yup.array()
                                //     .of(Yup.object().shape({ id: Yup.number().required() }))
                                //     .min(1, 'At least one privilege is required'),
                            })}
                            onSubmit={handleSubmit}
                            enableReinitialize // This allows the form to update when initialValues changes
                        >
                            {({ errors, touched, setFieldValue, values }) => (
                                <Form>
                                    <div className="p-4 md:p-5 space-y-4 -mt-2">
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <Input
                                                    label="Role Name"
                                                    type="text"
                                                    placeholder="Enter Role Name"
                                                    name="role_name"
                                                />
                                                
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <Input
                                                    label="Role Code"
                                                    type="text"
                                                    placeholder="Enter Role Code"
                                                    name="code"
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                            {/* {allPrivileges.map((item) => (
                                                <CheckBox
                                                    key={item.id}
                                                    label={item.name}
                                                    name={`privileges.${item.id}`}
                                                    value={item.id}
                                                    checked={item.id !== undefined && selectedPrivilegeIds.includes(item.id)}
                                                    handleChange={handleCheckboxChange}
                                                />
                                            ))} */}
                                        </div>
                                        {/* {errors.privileges && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {typeof errors.privileges === 'string' ? errors.privileges : 'At least one privilege is required'}
                                            </div>
                                        )} */}
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={isLoading} className='rounded-full'>
                                                {isLoading ? 'Updating...' : 'Update'}
                                            </Button>
                                            <Link href="/user-management/roles">
                                                <Button type="button" variant="destructive" className='rounded-full'>Back</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </CardContent>
            </Card>
        </DefaultLayout>
    );
};

export default EditRole;