import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import UserManagement from './user-management';

export const metadata: Metadata = {
    title: "Users | User Management",
    description:
        "User management for users in the system",
};

const UsersPage: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Users" />
            <div className="flex flex-col gap-2">
                <UserManagement/>
            </div>
        </DefaultLayout>

    );
};

export default UsersPage;