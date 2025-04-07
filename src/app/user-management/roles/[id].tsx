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
import { useRouter, useParams } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import { Privilege } from '@/types/Privilege';
import { getPrivileges } from '@/services/PrivilegesService';
import { Role } from '@/types/Role';
import { createRole, getRole } from '@/services/RoleService';
import CheckBox from '@/components/Inputs/CheckBox';

const EditRole = async ({params}:{
    params: { id: string } // Define the type of params here
}) => {
    const { setIsLoading, isLoading } = useLoading();
    const [allPrivileges, setAllPrivileges] = React.useState<Privilege[]>([]); // Renamed to allPrivileges
    const [selectedPrivilegeIds, setSelectedPrivilegeIds] = React.useState<number[]>([]); // Track selected IDs separately

    const router = useRouter();
    const { id } = params;

    const handleSubmit = async (
        values: Role,
        { resetForm }: FormikHelpers<Role>
    ) => {
        setIsLoading(true);
        try {
            await createRole(values).then((response) => {
                toast.success(response.data.message, {
                    duration: 1500,
                    position: 'top-right',
                });
                setTimeout(() => {
                    router.push("/user-management/roles");
                }, 2000);
            });
            resetForm();
        } catch (error) {
            console.error("ERROR", error);
            toast.error("Failed to create role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const { value, checked } = event.target;
        const privilegeId = parseInt(value);
        
        setSelectedPrivilegeIds(prev => 
            checked 
                ? [...prev, privilegeId] 
                : prev.filter(id => id !== privilegeId)
        );
        setFieldValue("privileges", selectedPrivilegeIds.map(id => ({ id })));
    }

    useEffect(() => {
        const  getRoleById = async () => {
            try {   
                const rs = await getRole(Number(id));
                console.log("Role Data:", rs.data);
                const privileges = rs.data.privileges.map((privilege: Privilege) => privilege.id);
                setSelectedPrivilegeIds(privileges);
            } catch (error) {
                toast.error("An error occurred while fetching role data.");
            }   
        }

        const fetchPrivileges = async () => {
            try {
                const rs = await getPrivileges();
                setAllPrivileges(rs.data);
            } catch (error) {
                toast.error("An error occurred while fetching privileges.");
            }
        };
        fetchPrivileges();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Create Role" />
            <Card className="w-full">
                <CardContent className="max-w-full overflow-x-auto">
                    <div className="flex flex-col gap-2">
                        <Formik
                            initialValues={{
                                role_name: '',
                                code: '',
                                privileges: [] as { id: number }[],
                                active: 'Y',
                            }}
                            validationSchema={Yup.object({
                                role_name: Yup.string().required('Role name is required'),
                                code: Yup.string().required('Role code is required'),
                                privileges: Yup.array()
                                    .of(Yup.object().shape({ id: Yup.number().required() }))
                                    .min(1, 'At least one privilege is required'),
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
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
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4.5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                            {allPrivileges.map((item) => (
                                                <CheckBox 
                                                    key={item.id}
                                                    label={item.name}
                                                    name="privileges"
                                                    value={item.id}
                                                    checked={item.id !== undefined && selectedPrivilegeIds.includes(item.id)}
                                                    handleChange={(event) => handleChange(event, setFieldValue)}
                                                />
                                            ))}
                                        </div>
                                        {errors.privileges && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {typeof errors.privileges === 'string' ? errors.privileges : 'At least one privilege is required'}
                                            </div>
                                        )}
                                        <Button type="submit" disabled={isLoading} className='rounded-full mx-2'>
                                            {isLoading ? 'Submitting...' : 'Submit'}
                                        </Button>
                                        <Link href="/user-management/roles">
                                            <Button type="reset" variant="destructive" className='rounded-full mx-2'>Back</Button>
                                        </Link>
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