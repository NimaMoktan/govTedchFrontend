"use client";
import { useEffect } from 'react';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import UserManagement from './user-management';
import { useLoading } from '@/context/LoadingContext';
import { toast } from 'sonner';

const UsersPage = () => {
    const { setIsLoading } = useLoading();
    useEffect(() => {
        // setIsLoading(false)
        
    }, [setIsLoading])

    return (
        <DefaultLayout>
            <>
            <Breadcrumb pageName="Users" />
            <div className="flex flex-col gap-2">
                <UserManagement/>
            </div>
            </>
        </DefaultLayout>

    );
};

export default UsersPage;